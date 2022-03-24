/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphImpl } from '../graph/GraphImpl.js'
import type { Graph, Node } from '../graph/types.js'
import type { Step } from '../steps/types.js'
import type { Store } from '../store/types.js'
import type { TableContainer } from '../tables/types.js'
import { observableNode } from '../verbs/nodeFactories/index.js'

export function makeStepGraph(
	steps: Step[],
	store: Store<TableContainer>,
): Graph<TableContainer> {
	const graph = new GraphImpl<TableContainer>()

	// create all of the nodes and register them into the graph
	for (const step of steps) {
		const node = createNode(step)
		graph.add(node)
	}

	// wire together named inputs between nodes
	for (const step of steps) {
		const current = graph.node(step.id)

		// if any inputs nodes are in the graph, bind them
		for (const [input, { node: sourceId, output }] of Object.entries(
			step.inputs,
		)) {
			const node = graph.hasNode(sourceId)
				? graph.node(sourceId)
				: observableNode(sourceId, store.observe(sourceId))

			current.bind({ input, node, output })
		}
	}

	return graph
}

function createNode(_step: Step): Node<TableContainer> {
	// todo
	return null as any
}
