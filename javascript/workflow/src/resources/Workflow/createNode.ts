/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableContainer } from '@datashaper/tables'

import type { Node } from '../../dataflow/index.js'
import * as verbs from '../../verbs/index.js'
import type { Step } from './types.js'

type NodeFactory = (id: string) => Node<TableContainer>

export function createNode(step: Step): Node<TableContainer> {
	const records = verbs as any as Record<string, NodeFactory>
	const factory = records[step.verb]
	if (!factory) {
		throw new Error(`unknown verb ${step.verb}`)
	}
	const node = factory(step.id)
	node.config = step.args
	return node
}
