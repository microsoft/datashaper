/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import type { Graph, Node } from '@essex/dataflow'
import { DefaultGraph, observableNode } from '@essex/dataflow'
import type { NamedPortBinding } from '../specification.js'
import type { Store } from '../store/types.js'
import type { ParsedSpecification } from '../steps/types.js'
import { createNode } from './createNode.js'

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
export function createGraph(
	{ steps, input, output }: ParsedSpecification,
	store: Store<TableContainer>,
): Graph<TableContainer> {
	const graph = new DefaultGraph<TableContainer>()

	function getNode(id: string): Node<TableContainer> {
		// bind to an input defined in the graph
		if (graph.hasNode(id)) {
			return graph.node(id)
		} else if (input.has(id)) {
			// bind to a declared input
			return observableNode(id, store.observe(id)) as any
		} else {
			throw new Error(`unknown node id or declared input: "${id}"`)
		}
	}

	// create all of the nodes and register them into the graph
	for (const step of steps) {
		const node = createNode(step)
		graph.add(node)
	}

	// wire together named inputs between nodes
	for (const step of steps) {
		const current = graph.node(step.id)

		// if any inputs nodes are in the graph, bind them
		for (const [input, binding] of Object.entries(step.input)) {
			if (input !== 'others') {
				const b = binding as NamedPortBinding
				current.bind({ input, node: getNode(b.node), output: b.output })
			} else {
				current.bindVariadic(
					(binding as NamedPortBinding[]).map(b => ({
						node: getNode(b.node),
						output: b.output,
					})),
				)
			}
		}
	}

	// wire pinned outputs into the store
	for (const [name, binding] of output.entries()) {
		const node = graph.node(binding.node)
		store.set(name, node.output(binding.output))
	}

	return graph
}
