/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'

export class DelegateSubject<T> extends BehaviorSubject<Maybe<T>> {
	public constructor(value?: Maybe<T>) {
		super(value ?? undefined)
	}
	private _subscription: Subscription | undefined

	public set input(value: Observable<Maybe<T>> | undefined) {
		this._subscription?.unsubscribe()
		if (value) {
			this._subscription = value.subscribe(this)
		} else {
			this.next(undefined)
		}
	}

	public dispose(): void {
		this._subscription?.unsubscribe()
		this._subscription = undefined
		this.complete()
	}
}
