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

	const factories = verbs as any
	// note that scoped verbs will have a root and a sub-object in their name, check for this case
	const [root, sub] = step.verb.split('.')
	// rome-ignore lint/style/noNonNullAssertion: if the split has a second value, the first will be defined
	const factory: NodeFactory = sub ? factories[root!][sub] : factories[root!]
	
	if (!factory) {
		throw new Error(`unknown verb ${step.verb}`)
	}
	const node = factory(step.id)
	node.config = step.args
	return node
}
