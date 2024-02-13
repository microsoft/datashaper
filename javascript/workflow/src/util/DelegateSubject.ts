/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'

/**
 * The DelegateSubject provides a stable BehaviorSubject for cases where the source observable may change.
 */
export class DelegateSubject<T> extends BehaviorSubject<Maybe<T>> {
	private _subscription: Subscription | undefined

	/**
	 * Create a new DelegateSubject
	 * @param value - The initial value
	 */
	public constructor(value?: Maybe<T>) {
		super(value ?? undefined)
	}

	/**
	 * Attach an input observable, which will act as the new data stream for this subject.
	 */
	public set input(source$: Observable<Maybe<T>> | undefined) {
		this.detach()
		if (source$ != null) {
			this._subscription = source$.subscribe((v) => this.next(v))
		} else {
			// If the source is undefined, we should emit undefined, waiting for a valid input
			this.next(undefined)
		}
	}

	/**
	 * Detach the current subscription
	 */
	private detach(): void {
		this._subscription?.unsubscribe()
		this._subscription = undefined
	}

	/**
	 * Dispose of the subject and any live subscriptions
	 */
	public dispose(): void {
		this._subscription?.unsubscribe()
		this._subscription = undefined
		this.complete()
	}
}
