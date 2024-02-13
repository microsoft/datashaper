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
import { NodeInput, NodeOutput, NodeStats } from '../types.js'

const log = debug('datashaper:BaseNode')

const DEFAULT_INPUT_NAME = NodeInput.Source
const DEFAULT_OUTPUT_NAME = NodeOutput.Result

export abstract class BaseNode<T, Config> implements Node<T, Config> {
	public id: NodeId = uuid()

	// Performance tracing
	private _version = 0
	private _recalculations = 0
	private _recalculationCauses: Record<string, number> = {}

	// Observable Outputs
	private _config$ = new BehaviorSubject<Maybe<Config>>(undefined)
	private _output$ = new Map<SocketName, BehaviorSubject<Maybe<T>>>()
	private _bindings$ = new BehaviorSubject<NodeBinding<T>[]>([])

	// Input Subscriptions
	private _inputValues$ = new Map<SocketName, BehaviorSubject<Maybe<T>>>()
	private _inputErrors$ = new Map<SocketName, BehaviorSubject<unknown>>()
	private _inputSubscriptions = new Map<SocketName, Subscription>()

	// Variadic Inputs
	private _disposeVariadicInputs: Maybe<() => void>
	private _getVariadicInputs: Maybe<() => Maybe<T>[]>

	// Socket Names
	protected _inputs: SocketName[] = []
	protected _outputs: SocketName[] = []

	/**
	 * Creates a new instance of the BaseNode
	 * @param inputs - the input socket names
	 */
	public constructor(
		inputs: SocketName[] = [], 
		outputs: SocketName[] = []) {
		this.inputs = inputs
		this.outputs = outputs
		this.ensureInput(DEFAULT_INPUT_NAME)
		this.ensureOutput(DEFAULT_OUTPUT_NAME)
	}

	public get inputs(): SocketName[] {
		return this._inputs
	}

	public get outputs(): SocketName[] {
		return this._outputs
	}

	protected set inputs(value: SocketName[]) {
		// Evict expired inputs
		for (const name of this._inputValues$.keys()) {
			if (!isDefaultInput(name) && !value.includes(name)) {
				this._inputValues$.get(name)?.complete()
				this._inputErrors$.get(name)?.complete()
				this._inputValues$.delete(name)
				this._inputErrors$.delete(name)
			}
		}

		this._inputs = value

		// Set up new input observables
		for (const input of value) {
			this.ensureInput(input)
		}
	}

	protected set outputs(value: SocketName[]) {
		// Evict expired outputs
		for (const name of this._output$.keys()) {
			if (!isDefaultOutput(name) && !value.includes(name)) {
				this._output$.get(name)?.complete()
				this._output$.delete(name)
			}
		}

		this._outputs = value

		// Set up new input observables
		for (const output of value) {
			this.ensureOutput(output)
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
		return this.inputValue$(name)?.value
	}

	protected inputValue$(
		name: SocketName = DEFAULT_INPUT_NAME,
	): BehaviorSubject<Maybe<T>> {
		this.ensureInput(name)
		return this._inputValues$.get(name) as BehaviorSubject<Maybe<T>>
	}

	protected inputError(name: SocketName = DEFAULT_INPUT_NAME): Maybe<unknown> {
		return this.inputError$(name)?.value
	}

	protected inputError$(
		name: SocketName = DEFAULT_INPUT_NAME,
	): BehaviorSubject<Maybe<unknown>> {
		this.ensureInput(name)
		return this._inputErrors$.get(name) as BehaviorSubject<Maybe<unknown>>
	}

	/**
	 * Gets a map of named inputs to the current value.
	 */
	protected getInputValues(): Record<SocketName, Maybe<T>> {
		const result: Record<SocketName, Maybe<T>> = {}
		for (const input of this.inputs) {
			result[input] = this._inputValues$.get(input)?.value
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
			result[input] = this.inputError(input)
		}
		return result
	}

	// #endregion inputs

	// #region output

	public output$(name: SocketName = DEFAULT_OUTPUT_NAME): BehaviorSubject<Maybe<T>> {
		this.ensureOutput(name)
		return this._output$.get(name) as BehaviorSubject<Maybe<T>>
	}

	public output(name: SocketName = DEFAULT_OUTPUT_NAME): Maybe<T> {
		return this.output$(name).value
	}

	// #endregion outputs

	// #region bind/unbind logic

	public bind(binding: NodeBinding<T> | VariadicNodeBinding<T>): void {
		const bindVariadic = (binding: VariadicNodeBinding<T>) => {
			this._disposeVariadicInputs?.()

			// empty array of initial inputs
			const values: Maybe<T>[] = binding.map(() => undefined)
			const subs = binding.map((i, index) => {
				if (i.node === this) {
					throw new Error('cannot bind to self')
				}
				return i.node.output$(i.output).subscribe((v) => {
					values[index] = v
					this.recalculate(`input_variadic@${i}`)
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
			const listenToInput = () => {
				const outputSocket = binding.node.output$(binding.output)
				log(`${this.id} listening to ${binding.node.id}`)
				if (binding.node === this) {
					throw new Error('cannot bind to self')
				}
				this._inputSubscriptions.set(
					input,
					outputSocket.subscribe({
						next: (value) => {
							log(`${this.id} receive ${value == null ? value : 'valid value'}`)
							if (errors.value != null) {
								errors.next(undefined)
							}
							if (values.value !== value) {
								values.next(value)
								this.recalculate(`input@${String(input)}[${binding.node.id}]`)
							}
						},
						error: (error: unknown) => {
							log(`${this.id} error from ${binding.node.id}`, error)
							values.next(undefined)
							errors.next(error)
							this?.recalculate('input_error')
						},
					}),
				)
			}

			const input = this.verifyInputSocketName(binding.input)
			const values = this.inputValue$(input)
			const errors = this.inputError$(input)
			if (this.hasBoundInputWithNode(input, binding.node.id)) {
				return
			}

			this.unbindSilent(input)
			addBinding()
			listenToInput()
		}

		if (Array.isArray(binding)) {
			bindVariadic(binding)
		} else {
			bindSingleInput(binding)
		}
	}

	protected hasBoundInputWithNode(name: SocketName, nodeId: NodeId) {
		return this.bindings.some(
			(i) => this.isSocketNameEqual(i.input, name) && i.node.id === nodeId,
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
	protected ensureInput(name: SocketName): void {
		name = this.verifyInputSocketName(name)
		if (!this._inputValues$.has(name)) {
			const input$ = new BehaviorSubject<Maybe<T>>(undefined)
			const error$ = new BehaviorSubject<unknown>(undefined)
			this._inputValues$.set(name, input$)
			this._inputErrors$.set(name, error$)
		}
	}
	protected ensureOutput(name: SocketName): void {
		name = this.verifyOutputSocketName(name)
		if (!this._output$.has(name)) {
			const output$ = new BehaviorSubject<Maybe<T>>(undefined)
			this._output$.set(name,  output$)
		}
	}

	protected verifyInputSocketName(name: SocketName = DEFAULT_INPUT_NAME): SocketName {
		if (isDefaultInput(name)) {
			return DEFAULT_INPUT_NAME
		} 
		if (!this.inputs.some((s) => s === name)) {
			throw new Error(`unknown input socket name "${String(name)}"`)
		}
		return name
	}

	protected verifyOutputSocketName(name: SocketName): SocketName {
		if (isDefaultOutput(name)) {
			return DEFAULT_OUTPUT_NAME
		} 
		if (!this.outputs.some((s) => String(s) === String(name))) {
			throw new Error(`unknown output socket name "${String(name)} of ${this.outputs.map(s => String(s)).join(", ")}"`)
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
	protected emit = (value: Maybe<T>, socketName: SocketName = DEFAULT_OUTPUT_NAME): void => {
		const socket = this.output$(socketName)
		if (value !== socket.value) {
			log(`${this.id} emitting ${value == null ? 'undefined' : 'value'}`)
 			this._version++
			socket.next(value)
		}
	}

	/**
	 * Emits a downstream error
	 * @param name - The input socket name
	 */
	protected emitError = (error: unknown, socketName: SocketName = DEFAULT_OUTPUT_NAME): void => {
		this.output$(socketName).error(error)
	}

	// #endregion
}

export const isDefaultInput = (name?: SocketName): name is undefined =>
	name === undefined || name === DEFAULT_INPUT_NAME

export const isDefaultOutput = (name?: SocketName): name is undefined =>
	name === undefined || name === DEFAULT_OUTPUT_NAME