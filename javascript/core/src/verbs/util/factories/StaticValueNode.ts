/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NodeId } from '../../../graph/index.js'
import { BaseNode } from '../../../graph/index.js'
import type { TableContainer } from '../../../tables/types.js'

export class StaticValueNode<T> extends BaseNode<T, { value: T }> {
	constructor(id: NodeId) {
		super()
		this.id = id
	}
	protected doRecalculate(): void {
		this.emit(this.config?.value)
	}
}

export function staticValueNode(
	id: string,
	value: TableContainer,
): StaticValueNode<TableContainer> {
	const result = new StaticValueNode<TableContainer>(id)
	result.config = { value }
	return result
}
