/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'
import type { NodeId } from '../../graph/index.js'
import { BaseNode } from '../../graph/index.js'
import type { TableContainer } from '../../tables/types.js'
import type { Maybe } from '../../primitives.js'

export class ObservableNode<T> extends BaseNode<T, void> {
	constructor(id: NodeId, source: Observable<Maybe<T>>) {
		super()
		this.id = id

		source.subscribe({
			next: value => this.emit(value),
			error: error => this.emitError(error),
		})
	}

	protected doRecalculate(): void {
		// do nothing
	}
}

export function observableNode(
	id: string,
	source: Observable<Maybe<TableContainer>>,
): ObservableNode<TableContainer> {
	return new ObservableNode<TableContainer>(id, source)
}
