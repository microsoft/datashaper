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
import { NodeInput } from '../types.js'

const log = debug('datashaper')

const DEFAULT_INPUT_NAME = NodeInput.Source

export abstract class BaseNode<T, Config> implements Node<T, Config> {
	public id: NodeId = uuid()

	// Observable Outputs
	private _config = new BehaviorSubject<Maybe<Config>>(undefined)
	private _output = new BehaviorSubject<Maybe<T>>(undefined)
	private _bindings = new BehaviorSubject<NodeBinding<T>[]>([])

	// Input Subscriptions
	private _inputValues = new Map<SocketName, BehaviorSubject<Maybe<T>>>()
	private _inputErrors = new Map<SocketName, BehaviorSubject<unknown>>()
	private _inputSubscriptions = new Map<SocketName, Subscription>()

	// Variadic Inputs
	private _disposeVariadicInputs: Maybe<() => void>
	private _getVariadicInputs: Maybe<() => Maybe<T>[]>

	public constructor(public readonly inputs: SocketName[] = []) {}

	public get config$(): Observable<Maybe<Config>> {
		return this._config
	}

	public get config(): Maybe<Config> {
		return this._config.value
	}

	public set config(value: Maybe<Config>) {
		this._config.next(value)
		void this.recalculate()
	}

	// #endregion field accessors

	// #region inputs

	public binding(name: SocketName = DEFAULT_INPUT_NAME): Maybe<NodeBinding<T>> {
		name = this.verifyInputSocketName(name)
		return this._bindings.value.find(i => i.input === name)
	}

	public get bindings$(): Observable<NodeBinding<T>[]> {
		return this._bindings
	}

	public get bindings(): NodeBinding<T>[] {
		return this._bindings.value
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

	public get output$(): Observable<Maybe<T>> {
		return this._output
	}

	public get output(): Maybe<T> {
		return this._output.value
	}

	// #endregion outputs

	// #region bind/unbind logic

	public bind(binding: NodeBinding<T> | VariadicNodeBinding<T>): void {
		const bindVariadic = (binding: VariadicNodeBinding<T>) => {
			this._disposeVariadicInputs?.()

			// empty array of initial inputs
			const values: Maybe<T>[] = binding.map(() => undefined)
			const subs = binding.map((i, index) =>
				i.node.output$.subscribe(v => {
					values[index] = v
					this.recalculate()
				}),
			)

			// provide class-level access to the current values
			this._disposeVariadicInputs = () => subs.forEach(s => s.unsubscribe())
			this._getVariadicInputs = () => values
		}

		const bindSingleInput = (binding: NodeBinding<T>) => {
			const addBinding = () => {
				this._bindings.next([
					...this.bindings.filter(i => i.input !== input),
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
				this._inputSubscriptions.set(
					input,
					binding.node.output$.subscribe({
						next: value => {
							this._inputValues.get(input)?.next(value)
							this._inputErrors.get(input)?.next(undefined)
							this.recalculate()
						},
						error: (error: unknown) => {
							this._inputValues.get(input)?.next(undefined)
							this._inputErrors.get(input)?.next(error)
							this?.recalculate()
						},
					}),
				)
			}

			const input = this.verifyInputSocketName(binding.input)
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
		this.recalculate()
	}

	protected hasBoundInput(name: SocketName): boolean {
		const existing = this.bindings.find(
			i =>
				i.input === name || (isDefaultInput(i.input) && isDefaultInput(name)),
		)
		return existing != null
	}

	public unbind(name: SocketName): void {
		name = this.verifyInputSocketName(name)
		if (this.hasBoundInput(name)) {
			this.unbindSilent(name)
			this.recalculate()
		} else {
			throw new Error(`no socket installed at "${String(name)}"`)
		}
	}

	private unbindSilent(name: SocketName): void {
		if (this._bindings.value.some(i => i.input === name)) {
			this._bindings.next(this._bindings.value.filter(i => i.input !== name))
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
		} else if (!this.inputs.some(s => s === name)) {
			throw new Error(`unknown input socket name "${String(name)}"`)
		}
		return name
	}

	// #endregion

	// #region recalculation

	/**
	 * Calculate the value of this processing node. This may be invoked even if this
	 * processing node is not fully configured. recalulate() should account for this
	 */
	protected recalculate = (): void => {
		try {
			this.doRecalculate()
		} catch (err) {
			log('recalculation error in node ' + this.id, err)
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
	protected emit = (value: Maybe<T>): void => {
		if (value !== this.output) {
			this._output.next(value)
		}
	}

	/**
	 * Emits a downstream error
	 * @param name - The input socket name
	 */
	protected emitError = (error: unknown): void => {
		this._output.error(error)
	}

	// #endregion
}

export const isDefaultInput = (name?: SocketName): name is undefined =>
	name === undefined || name === DEFAULT_INPUT_NAME
