/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultGraph, observableNode } from '../graph/index.js'
import type { Graph, Node } from '../graph/types.js'
import type { InputBinding } from '../specification.js'
import type { Step } from '../steps/index.js'
import type { Store } from '../store/types.js'
import type { TableContainer } from '../tables/types.js'
import type { NodeFactory } from '../verbs/index.js'
import * as verbs from '../verbs/index.js'

const EMPTY: Record<string, unknown> = Object.freeze({})

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
	steps: Step[],
	store: Store<TableContainer>,
): Graph<TableContainer> {
	const graph = new DefaultGraph<TableContainer>()
	function getNode(id: string): Node<TableContainer> {
		return graph.hasNode(id)
			? // bind to an input defined in the graph
			  graph.node(id)
			: // bind to a named table observable
			  (observableNode(id, store.observe(id)) as any)
	}

	// create all of the nodes and register them into the graph
	for (const step of steps) {
		const node = createNode(step)
		graph.add(node)

		// wire pinned outputs into the store
		for (const [output, name] of Object.entries(step.output || EMPTY)) {
			store.set(name, node.output(output))
		}
	}

	// wire together named inputs between nodes
	for (const step of steps) {
		const current = graph.node(step.id)

		// if any inputs nodes are in the graph, bind them
		for (const [input, binding] of Object.entries(step.input)) {
			if (input !== 'others') {
				const b = binding as InputBinding
				current.bind({ input, node: getNode(b.node), output: b.output })
			} else {
				current.bindVariadic(
					(binding as InputBinding[]).map(b => ({
						node: getNode(b.node),
						output: b.output,
					})),
				)
			}
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
