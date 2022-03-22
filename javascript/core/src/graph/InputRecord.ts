/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Subscription} from 'rxjs';
import { Subject } from 'rxjs'

import type { Maybe, NodeBinding } from './types'

export interface InputRecord<T> {
	readonly binding: NodeBinding<T>
	readonly current: Maybe<T>
	readonly error: unknown
	onValueChange(handler: () => void): void

	dispose(): void
}

export class InputRecordImpl<T> implements InputRecord<T> {
	private _current: T | undefined
	private _error: unknown
	private _onValueChange: Subject<void> = new Subject<void>()
	private _bindingSubscription: Subscription
	private _valueChangeSubscription: Subscription | undefined

	constructor(public readonly binding: NodeBinding<T>) {
		this._bindingSubscription = binding.node.output(binding.output).subscribe({
			next: v => {
				this._error = undefined
				this._current = v
				this._onValueChange.next()
			},
			error: e => {
				this._error = e
				this._current = undefined
				this._onValueChange.next()
			},
		})
	}

	public onValueChange(handler: () => void): void {
		const subscription = this._onValueChange.subscribe(handler)
		this._valueChangeSubscription = subscription
	}

	public get current(): Maybe<T> {
		return this._current
	}

	public get error(): unknown {
		return this._error
	}

	public dispose(): void {
		this._bindingSubscription.unsubscribe()
		this._valueChangeSubscription?.unsubscribe()
	}
}
