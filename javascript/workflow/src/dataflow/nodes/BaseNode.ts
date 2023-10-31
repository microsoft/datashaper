/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debug from 'debug'
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject } from 'rxjs'
import { v4 as uuid } from 'uuid'

import type { Maybe } from '../../primitives.js'
import type {
	Node,
	NodeBinding,
	NodeId,
	SocketName,
	VariadicNodeBinding,
} from '../types'
import { NodeInput, NodeStats } from '../types.js'

const log = debug('datashaper:BaseNode')

const DEFAULT_INPUT_NAME = NodeInput.Source

export abstract class BaseNode<T, Config> implements Node<T, Config> {
	public id: NodeId = uuid()

	// Performance tracing
	private _version = 0
	private _recalculations = 0
	private _recalculationCauses: Record<string, number> = {}

	// Observable Outputs
	private _config$ = new BehaviorSubject<Maybe<Config>>(undefined)
	private _output$ = new BehaviorSubject<Maybe<T>>(undefined)
	private _bindings$ = new BehaviorSubject<NodeBinding<T>[]>([])

	// Named, non-default outputs
	private _namedOutputs: Map<SocketName, BehaviorSubject<Maybe<T>>> = new Map()

	// Input Subscriptions
	private _inputValues = new Map<SocketName, BehaviorSubject<Maybe<T>>>()
	private _inputErrors = new Map<SocketName, BehaviorSubject<unknown>>()
	private _inputSubscriptions = new Map<SocketName, Subscription>()

	// Variadic Inputs
	private _disposeVariadicInputs: Maybe<() => void>
	private _getVariadicInputs: Maybe<() => Maybe<T>[]>

	/**
	 * Creates a new instance of the BaseNode
	 * @param inputs - the input socket names
	 */
	public constructor(
		public readonly inputs: SocketName[] = [],
		public readonly outputs: SocketName[] = [],
	) {
		for (const output of outputs) {
			this._namedOutputs.set(output, new BehaviorSubject<Maybe<T>>(undefined))
		}
	}

	public get stats(): NodeStats {
		return {
			id: this.id,
			version: this._version,
			recalculations: this._recalculations,
			recalculationCauses: this._recalculationCauses,
		}
	}

	public get config$(): Observable<Maybe<Config>> {
		return this._config$
	}

	public get config(): Maybe<Config> {
		return this._config$.value
	}

	public set config(value: Maybe<Config>) {
		if (value !== this.config) {
			this._config$.next(value)
			log(`${this.id} set config`)
			if (!this.isBindingRequired || this.bindings.length > 0) {
				void this.recalculate('configure')
			}
		}
	}

	/**
	 * If 'isBindingRequired' is true (the default), then config-changes will not drive recomputes if no input
	 * bindings are present.
	 */
	protected get isBindingRequired(): boolean {
		return true
	}

	// #endregion field accessors

	// #region inputs

	public binding(name: SocketName = DEFAULT_INPUT_NAME): Maybe<NodeBinding<T>> {
		name = this.verifyInputSocketName(name)
		return this.bindings.find((i) => i.input === name)
	}

	public get bindings$(): Observable<NodeBinding<T>[]> {
		return this._bindings$
	}

	public get bindings(): NodeBinding<T>[] {
		return this._bindings$.value
	}

	protected inputValue(name: SocketName = DEFAULT_INPUT_NAME): Maybe<T> {
		name = this.verifyInputSocketName(name)
		return this._inputValues.get(name)?.value
	}

	/**
	 * Gets a map of named inputs to the current value.
	 */
	protected getInputValues(): Record<SocketName, Maybe<T>> {
		const result: Record<SocketName, Maybe<T>> = {}
		for (const input of this.inputs) {
			result[input] = this._inputValues.get(input)?.value
		}
		return result
	}

	protected getVariadicInputValues(): Maybe<T>[] {
		return this._getVariadicInputs?.() ?? []
	}

	/**
	 * Gets a map of named inputs to any errors emitted
	 */
	protected getInputErrors(): Record<SocketName, unknown> {
		const result: Record<SocketName, unknown> = {}
		for (const input of this.inputs) {
			result[input] = this._inputErrors.get(input)?.value
		}
		return result
	}

	// #endregion inputs

	// #region output

	public get output$(): BehaviorSubject<Maybe<T>> {
		return this._output$
	}

	public get output(): Maybe<T> {
		return this._output$.value
	}

	public namedOutput$(name: SocketName): BehaviorSubject<Maybe<T>> {
		const result = this._namedOutputs.get(name)
		if (result == null) {
			throw new Error(`no output named "${String(name)}"`)
		}
		return result
	}

	public namedOutput(name: SocketName): Maybe<T> {
		return this.namedOutput$(name).value
	}

	// #endregion outputs

	// #region bind/unbind logic

	public bind(binding: NodeBinding<T> | VariadicNodeBinding<T>): void {
		const bindVariadic = (binding: VariadicNodeBinding<T>) => {
			this._disposeVariadicInputs?.()

			// empty array of initial inputs
			const values: Maybe<T>[] = binding.map(() => undefined)
			const subs = binding.map((binding, index) => {
				const output =
					binding.output == null
						? binding.node.output$
						: binding.node.namedOutput$(binding.output)
				return output.subscribe((v) => {
					values[index] = v
					this.recalculate(`input_variadic@${binding}`)
				})
			})

			// provide class-level access to the current values
			this._disposeVariadicInputs = () => {
				for (const sub of subs) {
					sub.unsubscribe()
				}
			}
			this._getVariadicInputs = () => values
			this.recalculate('bindvar')
		}

		const bindSingleInput = (binding: NodeBinding<T>) => {
			const addBinding = () => {
				this._bindings$.next([
					...this.bindings.filter((i) => i.input !== input),
					binding,
				])
			}
			const lazilyAddInputObservable = () => {
				if (!this._inputValues.has(input)) {
					this._inputValues.set(input, new BehaviorSubject<Maybe<T>>(undefined))
					this._inputErrors.set(input, new BehaviorSubject<unknown>(undefined))
				}
			}
			const listenToInput = () => {
				const output =
					binding.output == null
						? binding.node.output$
						: binding.node.namedOutput$(binding.output)

				this._inputSubscriptions.set(
					input,
					output.subscribe({
						next: (value) => {
							const values = this._inputValues.get(input) as BehaviorSubject<
								Maybe<T>
							>
							const errors = this._inputErrors.get(
								input,
							) as BehaviorSubject<unknown>

							if (errors.value != null) {
								errors.next(undefined)
							}
							if (values.value !== value) {
								values.next(value)
								this.recalculate(`input@${String(input)}[${binding.node.id}]`)
							}
						},
						error: (error: unknown) => {
							const values = this._inputValues.get(input) as BehaviorSubject<
								Maybe<T>
							>
							const errors = this._inputErrors.get(
								input,
							) as BehaviorSubject<unknown>

							values.next(undefined)
							errors.next(error)
							this?.recalculate('input_error')
						},
					}),
				)
			}

			const input = this.verifyInputSocketName(binding.input)
			if (this.hasBoundInputWithNode(input, binding.node.id, binding.output)) {
				return
			}

			this.unbindSilent(input)
			addBinding()
			lazilyAddInputObservable()
			listenToInput()
		}

		if (Array.isArray(binding)) {
			bindVariadic(binding)
		} else {
			bindSingleInput(binding)
		}
	}

	protected hasBoundInputWithNode(
		name: SocketName,
		nodeId: NodeId,
		output: SocketName | undefined,
	) {
		return this.bindings.some(
			(i) =>
				this.isSocketNameEqual(i.input, name) &&
				i.node.id === nodeId &&
				output === i.output,
		)
	}

	protected hasBoundInput(name: SocketName): boolean {
		return this.bindings.some((i) => this.isSocketNameEqual(i.input, name))
	}

	protected isSocketNameEqual(
		name: SocketName | undefined,
		name2: SocketName,
	): boolean {
		return name === name2 || (isDefaultInput(name) && isDefaultInput(name2))
	}

	public unbind(name: SocketName): void {
		name = this.verifyInputSocketName(name)
		log(`${this.id} unbinding socket ${String(name)}`)
		if (this.hasBoundInput(name)) {
			this.unbindSilent(name)
			this.recalculate('unbind')
		} else {
			throw new Error(`no socket installed at "${String(name)}"`)
		}
	}

	private unbindSilent(name: SocketName): void {
		if (this._bindings$.value.some((i) => i.input === name)) {
			this._bindings$.next(
				this._bindings$.value.filter((i) => i.input !== name),
			)
		}
		this._inputSubscriptions.get(name)?.unsubscribe()
		this._inputSubscriptions.delete(name)
	}

	// #endregion

	// #region socket name verification

	/**
	 * Verifies that an input socket name is known
	 * @param name - The input socket name
	 */
	protected verifyInputSocketName(name?: SocketName): SocketName {
		if (isDefaultInput(name)) {
			return DEFAULT_INPUT_NAME
		} else if (!this.inputs.some((s) => s === name)) {
			throw new Error(`unknown input socket name "${String(name)}"`)
		}
		return name
	}

	// #endregion

	// #region recalculation

	/**
	 * Calculate the value of this processing node. This may be invoked even if this
	 * processing node is not fully configured. recalculate() should account for this
	 */
	protected recalculate = (cause: string): void => {
		try {
			this._recalculations++
			if (this._recalculationCauses[cause] == null) {
				this._recalculationCauses[cause] = 0
			}
			this._recalculationCauses[cause]++
			this.doRecalculate()
		} catch (err) {
			log(`recalculation error in node ${this.id}`, err)
			this.emitError(err)
		}
	}

	/**
	 * Abstract logic for performing the node recalculation
	 */
	protected abstract doRecalculate(): void

	// #endregion

	// #region value, error emission

	/**
	 * Emits a new value into the named output socket
	 * @param value - The output value
	 * @param output - The output socket name
	 */
	protected emit = (value: Maybe<T>, output?: string | undefined): void => {
		const observable = output == null ? this.output$ : this.namedOutput$(output)

		if (value !== observable.value) {
			this._version++
			log(`${this.id} emitting ${value == null ? 'undefined' : 'value'}`)
			observable.next(value ?? undefined)
		}
	}

	/**
	 * Emits a downstream error
	 * @param name - The input socket name
	 */
	protected emitError = (error: unknown): void => {
		this._output$.error(error)
		for (const o of this._namedOutputs.values()) {
			o.error(error)
		}
	}

	// #endregion
}

export const isDefaultInput = (name?: SocketName): name is undefined =>
	name === undefined || name === DEFAULT_INPUT_NAME
