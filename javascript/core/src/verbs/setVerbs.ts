/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SetOp } from './types/index.js'
import { SetOperationNode } from './util/factories.js'

export function concat(id: string): SetOperationNode {
	return new SetOperationNode(id, SetOp.Concat)
}

export function difference(id: string): SetOperationNode {
	return new SetOperationNode(id, SetOp.Difference)
}

export function intersect(id: string): SetOperationNode {
	return new SetOperationNode(id, SetOp.Intersect)
}

export function union(id: string): SetOperationNode {
	return new SetOperationNode(id, SetOp.Union)
}
