/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'
import { BehaviorSubject, Subject } from 'rxjs'
import { v4 as uuid } from 'uuid'

import type { BoundInput } from './BoundInput.js'
import { BoundInputImpl } from './BoundInput.js'
import type { Maybe, Node, NodeBinding, NodeId, SocketName } from './types'

const DEFAULT_OUTPUT_NAME = 'DWC.DefaultOutput'

export abstract class BaseNode<T, Config> implements Node<T, Config> {
	// #region fields

	protected _id = uuid()
	private _config: Maybe<Config>

	// inputs
	private _inputs: Map<SocketName, BoundInput<T>> = new Map()
	private _bindingsChanged = new Subject<void>()

	// outputs
	private _outputs: Map<SocketName, BehaviorSubject<Maybe<T>>> = new Map()

	// #endregion fields

	public constructor(
		public readonly inputs: SocketName[] = [],
		public readonly outputs: SocketName[] = [],
	) {
		// create new subjects for each output socket
		;[...outputs, DEFAULT_OUTPUT_NAME].forEach(o => {
			this._outputs.set(o, new BehaviorSubject<Maybe<T>>(undefined))
		})
	}

	// #region field accessors

	public get id(): NodeId {
		return this._id
	}

	public set id(value: NodeId) {
		this._id = value
	}

	public get config(): Maybe<Config> {
		return this._config
	}

	public set config(value: Maybe<Config>) {
		this._config = value
		void this.recalculate()
	}

	public get onBindingsChanged(): Observable<void> {
		return this._bindingsChanged
	}

	// #endregion field accessors

	// #region inputs

	public binding(name: SocketName): Maybe<NodeBinding<T>> {
		return this._inputs.get(name)?.binding
	}

	public bindings(): NodeBinding<T>[] {
		return [...this._inputs.values()].map(i => i.binding)
	}

	public get bindingsCount(): number {
		return this._inputs.size
	}

	protected inputValue(name: string): Maybe<T> {
		this.verifyInputSocketName(name)
		return this._inputs.get(name)?.current
	}

	/**
	 * Gets a map of named inputs to the current value.
	 * @protected
	 */
	protected getInputValues(): Record<SocketName, Maybe<T>> {
		const result: Record<SocketName, Maybe<T>> = {}
		for (const key of this._inputs.keys()) {
			result[key] = this._inputs.get(key)?.current
		}
		return result
	}

	/**
	 * Gets a map of named inputs to any errors emitted
	 * @protected
	 */
	protected getInputErrors(): Record<SocketName, unknown> {
		const result: Record<SocketName, unknown> = {}
		for (const key in this._inputs.keys()) {
			const error = this._inputs.get(key)?.error
			if (error) {
				result[key] = error
			}
		}
		return result
	}

	// #endregion inputs

	// #region outputs

	public output(name: SocketName = DEFAULT_OUTPUT_NAME): Observable<Maybe<T>> {
		this.verifyOutputSocketName(name)
		return this._outputs.get(name) as Observable<Maybe<T>>
	}

	public outputValue(name: SocketName = DEFAULT_OUTPUT_NAME): Maybe<T> {
		this.verifyOutputSocketName(name)
		return this._outputs.get(name)?.value
	}

	// #endregion outputs

	// #region bind/unbind logic

	public bind(binding: NodeBinding<T>): void {
		const name = binding.input
		this.verifyInputSocketName(name)
		// uninstall any existing upstream socket connection
		if (this._inputs.has(name)) {
			this.unbind(name)
		}
		// subscribe to the new input
		const input: BoundInput<T> = new BoundInputImpl(binding)
		this._inputs.set(name, input as BoundInput<T>)
		input.onValueChange(() => this.recalculate())
		this.recalculate()
		this._bindingsChanged.next()
	}

	public unbind(name: SocketName): void {
		this.verifyInputSocketName(name)
		if (this._inputs.has(name)) {
			// unsubscribe from updates
			this._inputs.get(name)?.dispose()
			this._inputs.delete(name)
			void this.recalculate()
			this._bindingsChanged.next()
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
	protected verifyInputSocketName(name: SocketName): void {
		if (!this.inputs.some(s => s === name)) {
			throw new Error(`unknown input socket name "${String(name)}"`)
		}
	}

	/**
	 * Verifies that an output socket name is known
	 * @param name - The input socket name
	 */
	protected verifyOutputSocketName(name: SocketName): void {
		if (name === DEFAULT_OUTPUT_NAME) {
			return
		} else if (!this.outputs.some(s => s === name)) {
			throw new Error(`unknown output socket name "${String(name)}"`)
		}
	}

	// #endregion

	// #region recalculation

	/**
	 * Calculate the value of this processing node. This may be invoked even if this
	 * processing node is not fully configured. recalulate() should account for this
	 */
	protected recalculate = async (): Promise<void> => {
		try {
			await this.doRecalculate()
		} catch (error: unknown) {
			this.emitError(error)
		}
	}

	/**
	 * Abstract logic for performing the node recalculation
	 */
	protected abstract doRecalculate(): Promise<void> | void

	// #endregion

	// #region value, error emission

	/**
	 * Emits a new value into the named output socket
	 * @param value - The output value
	 * @param output - The output socket name
	 */
	protected emit(value: Maybe<T>, output = DEFAULT_OUTPUT_NAME): void {
		this.verifyOutputSocketName(output)
		if (value !== this._outputs.get(output)?.value) {
			this._outputs.get(output)?.next(value)
		}
	}

	/**
	 * Emits a downstream error
	 * @param name - The input socket name
	 */
	protected emitError(error: unknown): void {
		this._outputs.forEach(o => o.error(error))
	}

	// #endregion
}
