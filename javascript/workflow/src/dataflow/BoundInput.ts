/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Subscription } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import type { NodeBinding, SocketName } from './types.js'

export interface BoundInput<T> {
	readonly name: SocketName
	readonly binding: NodeBinding<T>
	readonly current: Maybe<T>
	readonly error: unknown
	onValueChange(handler: () => void): void

	dispose(): void
}

export class DefaultBoundInput<T> implements BoundInput<T> {
	private _current = new BehaviorSubject<Maybe<T>>(undefined)
	private _error: unknown
	private _bindingSubscription: Subscription
	private _valueChangeSubscription: Subscription | undefined

	constructor(
		public readonly name: SocketName,
		public readonly binding: NodeBinding<T>,
	) {
		this._bindingSubscription = binding.node.output$(binding.output).subscribe({
			next: v => {
				this._error = undefined
				this._current.next(v)
			},
			error: e => {
				this._error = e
				this._current.next(undefined)
			},
		})
	}

	public onValueChange(handler: () => void): void {
		const subscription = this._current.subscribe(handler)
		this._valueChangeSubscription = subscription
	}

	public get current(): Maybe<T> {
		return this._current.value
	}

	public get error(): unknown {
		return this._error
	}

	public dispose(): void {
		this._bindingSubscription.unsubscribe()
		this._valueChangeSubscription?.unsubscribe()
	}
}
