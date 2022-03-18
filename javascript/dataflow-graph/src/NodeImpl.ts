/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject } from 'rxjs'
import { v4 as uuid } from 'uuid'

import type { Maybe, Node } from './types'

const DEFAULT_OUTPUT_NAME = 'DWC.DefaultOutput'

export abstract class NodeImpl<T, Config> implements Node<T, Config> {
	public id = uuid()
	private _config: Maybe<Config>

	// upstream socket wiring
	private _inputSubscriptions: Map<string, Subscription> = new Map()
	private _inputValues: Map<string, Maybe<T>> = new Map()
	private _outputs: Map<string, BehaviorSubject<Maybe<T>>> = new Map()

	public constructor(
		public readonly inputs: string[],
		public readonly outputs: string[] = [],
	) {
		// create new subjects for each output socket
		;[...outputs, DEFAULT_OUTPUT_NAME].forEach(o => {
			this._outputs.set(o, new BehaviorSubject<Maybe<T>>(undefined))
		})
	}

	public get config(): Maybe<Config> {
		return this._config
	}

	public set config(value: Maybe<Config>) {
		this._config = value
		this.recalculate()
	}

	protected inputValue(name: string): Maybe<T> {
		this.verifyInputSocketName(name)
		return this._inputValues.get(name)
	}

	public output(name = DEFAULT_OUTPUT_NAME): Observable<Maybe<T>> {
		this.verifyOutputSocketName(name)
		return this._outputs.get(name) as Observable<Maybe<T>>
	}

	public outputValue(name = DEFAULT_OUTPUT_NAME): Maybe<T> {
		this.verifyOutputSocketName(name)
		return this._outputs.get(name)?.value
	}

	public install(name: string, socket: Observable<Maybe<T>>): void {
		this.verifyInputSocketName(name)
		// uninstall any existing upstream socket connection
		if (this._inputSubscriptions.has(name)) {
			this.uninstall(name)
		}
		// subscribe to the new input
		const subscription = socket.subscribe(value => {
			this._inputValues.set(name, value)
			this.recalculate()
		})
		this._inputSubscriptions.set(name, subscription)
	}

	public uninstall(name: string): void {
		this.verifyInputSocketName(name)
		if (this._inputSubscriptions.has(name)) {
			// unsubscribe from updates
			this._inputSubscriptions.get(name)?.unsubscribe()

			// remove the node
			this._inputSubscriptions.delete(name)

			this.recalculate()
		} else {
			throw new Error(`no socket installed at "${name}"`)
		}
	}

	/**
	 * Emits a new value into the named output socket
	 * @param value The output value
	 * @param output The output socket name
	 */
	protected emit(value: Maybe<T>, output = DEFAULT_OUTPUT_NAME): void {
		this.verifyOutputSocketName(output)
		this._outputs.get(output)?.next(value)
	}

	protected verifyInputSocketName(name: string): void {
		if (!this.inputs.some(s => s === name)) {
			throw new Error(`unknown input socket name "${name}"`)
		}
	}

	protected verifyOutputSocketName(name: string): void {
		if (name === DEFAULT_OUTPUT_NAME) {
			return
		} else if (!this.outputs.some(s => s === name)) {
			throw new Error(`unknown output socket name "${name}"`)
		}
	}

	/**
	 * Calculate the value of this processing node. This may be invoked even if this
	 * processing node is not fully configured. recalulate() should account for this
	 */
	protected recalculate(): void {
		try {
			this.doRecalculate()
		} catch (error: unknown) {
			this._outputs.forEach(v => {
				v.error(error)
			})
			throw error
		}
	}

	protected abstract doRecalculate(): void
}
