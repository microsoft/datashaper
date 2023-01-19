/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'

import type { Maybe } from '../../primitives.js'
import { BaseNode } from './BaseNode.js'

export class ObservableNode<T> extends BaseNode<T, void> {
	constructor(source: Observable<Maybe<T>>) {
		super()
		source.subscribe({
			next: (value) => this.emit(value),
			error: (error) => this.emitError(error),
		})
	}

	protected doRecalculate(): void {
		// do nothing
	}
}

export function observableNode<T>(
	id: string,
	source: Observable<Maybe<T>>,
): ObservableNode<T> {
	const result = new ObservableNode<T>(source)
	result.id = id
	return result
}
