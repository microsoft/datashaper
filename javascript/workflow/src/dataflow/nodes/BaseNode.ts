/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debug from 'debug'
import type { Observable } from 'rxjs'
import { BehaviorSubject, map } from 'rxjs'
import { v4 as uuid } from 'uuid'

import type { Maybe } from '../../primitives.js'
import type { BoundInput } from '../BoundInput.js'
import { DefaultBoundInput } from '../BoundInput.js'
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
	// #region fields

	protected _id = uuid()
	private _config = new BehaviorSubject<Maybe<Config>>(undefined)
	private _inputs = new BehaviorSubject<BoundInput<T>[]>([])
	private _output = new BehaviorSubject<Maybe<T>>(undefined)

	// #endregion fields

	public constructor(public readonly inputs: SocketName[] = []) {}

	// #region field accessors

	public get id(): NodeId {
		return this._id
	}

	public set id(value: NodeId) {
		this._id = value
	}

	public get config(): Maybe<Config> {
		return this._config.value
	}

	public set config(value: Maybe<Config>) {
		this._config.next(value)
		void this.recalculate()
	}

	public get config$(): Observable<Maybe<Config>> {
		return this._config
	}

	// #endregion field accessors

	// #region inputs

	public binding(name: SocketName = DEFAULT_INPUT_NAME): Maybe<NodeBinding<T>> {
		return this._inputs.value.find(i => i.name === name)?.binding
	}

	public get bindings$(): Observable<NodeBinding<T>[]> {
		return this._inputs.pipe(map(inputs => inputs.map(i => i.binding)))
	}

	public get bindings(): NodeBinding<T>[] {
		return this._inputs.value.map(i => i.binding)
	}

	protected inputValue(name: SocketName = DEFAULT_INPUT_NAME): Maybe<T> {
		this.verifyInputSocketName(name)
		return this._inputs.value.find(i => i.name === name)?.current
	}

	/**
	 * Gets a map of named inputs to the current value.
	 */
	protected getInputValues(): Record<SocketName, Maybe<T>> {
		const result: Record<SocketName, Maybe<T>> = {}
		this._inputs.value.forEach(i => (result[i.name] = i.current))
		return result
	}

	/**
	 * Gets a map of named inputs to any errors emitted
	 */
	protected getInputErrors(): Record<SocketName, unknown> {
		const result: Record<SocketName, unknown> = {}
		this._inputs.value.forEach(i => (result[i.name] = i.error))
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
		if (Array.isArray(binding)) {
			this.bindVariadic(binding)
		} else {
			const name = this.verifyInputSocketName(
				binding.input ?? DEFAULT_INPUT_NAME,
			)
			// uninstall any existing upstream socket connection
			if (this.hasBoundInput(name)) {
				this.unbind(name)
			}

			// subscribe to the new input
			const input: BoundInput<T> = new DefaultBoundInput(name, binding)
			this._inputs.next([
				...this._inputs.value.filter(i => i.name !== name),
				input,
			])

			input.onValueChange(() => this.recalculate())
			this.recalculate()
		}
	}

	protected hasBoundInput(name: SocketName): boolean {
		const existing = this._inputs.value.find(i => i.name === name)
		return existing != null
	}

	protected bindVariadic(_inputs: VariadicNodeBinding<T>): void {
		throw new Error('variadic input not supported')
	}

	public unbind(name: SocketName): void {
		this.verifyInputSocketName(name)
		if (this.hasBoundInput(name)) {
			// unsubscribe from updates
			this._inputs.value.find(i => i.name === name)?.dispose()
			this._inputs.next(this._inputs.value.filter(i => i.name !== name))
			void this.recalculate()
		} else {
			throw new Error(`no socket installed at "${String(name)}"`)
		}
	}

	// #endregion

	// #region socket name verification

	/**
	 * Verifies that an input socket name is known
	 * @param name - The input socket name
	 */
	protected verifyInputSocketName(name: SocketName): SocketName {
		if (name !== DEFAULT_INPUT_NAME && !this.inputs.some(s => s === name)) {
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
