/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Subject } from 'rxjs'

import type { Unsubscribe } from '../primitives.js'
import type { Disposable } from './types.js'

export abstract class Observed implements Disposable {
	protected _onChange = new Subject<void>()
	protected _onDispose = new Subject<void>()

	public onChange(handler: () => void, fireSync?: boolean): Unsubscribe {
		const sub = this._onChange.subscribe(handler)
		if (fireSync) {
			handler()
		}
		return () => sub.unsubscribe()
	}

	public onDispose(handler: () => void): Unsubscribe {
		const sub = this._onDispose.subscribe(handler)
		return () => sub.unsubscribe()
	}

	public dispose(): void {
		this._onDispose.next()
		this._onDispose.complete()
		this._onChange.complete()
	}
}
