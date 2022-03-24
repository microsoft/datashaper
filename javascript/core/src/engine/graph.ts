/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphImpl } from '../graph/GraphImpl.js'
import type { Graph, Node } from '../graph/types.js'
import type { Step } from '../steps/types.js'
import type { Store } from '../store/types.js'
import type { TableContainer } from '../tables/types.js'
import type { NodeFactory } from '../verbs/index.js'
import * as verbs from '../verbs/index.js'
import { observableNode } from '../verbs/nodeFactories/index.js'

/**
 * This function establishes the reactive processing graph for executing transformation steps.
 *
 * A graph is constructed using each step definition as a node. Any table definitions they export
 * are registered into the tableContainer. Any inputs that are defined but not accounted for in the
 * graph will be wired to the TableContainer using the observable pattern.
 *
 * @param steps - The processing steps
 * @param store - The table container
 * @returns The built reactive processing graph
 */
export function graph(
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
				? // bind to an input defined in the graph
				  graph.node(sourceId)
				: // bind to a named table observable
				  observableNode(sourceId, store.observe(sourceId))

			current.bind({ input, node, output })
		}
	}

	// Wire any named outputs into the store
	for (const step of steps) {
		for (const { output, name: storeName } of step.pinnedOutputs) {
			const node = graph.node(step.id)
			store.set(storeName, node.output(output))
		}
	}

	return graph
}

function createNode(step: Step): Node<TableContainer> {
	const records = verbs as any as Record<string, NodeFactory>
	const factory = records[step.verb]
	if (!factory) {
		throw new Error(`unknown verb ${step.verb}`)
	}
	const node = factory(step.id)
	node.config = step.args
	return node
}
