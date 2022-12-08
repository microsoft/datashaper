/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Subscription } from 'rxjs'
import { Subject } from 'rxjs'

import type { Unsubscribe } from '../primitives.js'

export class Disposable {
	protected _onDispose = new Subject<void>()

	public onDispose(handler: Subscription | Unsubscribe): Unsubscribe {
		const handlerFn =
			typeof handler === 'function' ? handler : () => handler.unsubscribe()
		const sub = this._onDispose.subscribe(handlerFn)
		return () => sub.unsubscribe()
	}

	public dispose(): void {
		this._onDispose.next()
		this._onDispose.complete()
	}
}
