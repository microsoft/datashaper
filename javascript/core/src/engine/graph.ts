/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultGraph, observableNode } from '../graph/index.js'
import type { Graph, Node } from '../graph/types.js'
import type { Step } from '../steps/types.js'
import type { Store } from '../store/types.js'
import type { TableContainer } from '../tables/types.js'
import type { NodeFactory } from '../verbs/index.js'
import * as verbs from '../verbs/index.js'

const DEFAULT_OUTPUT = 'default'
const DEFAULT_INPUT = 'default'
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

	// create all of the nodes and register them into the graph
	for (const step of steps) {
		const node = createNode(step)
		graph.add(node)

		// wire pinned outputs into the store
		for (const [output, name] of Object.entries(step.outputs || EMPTY)) {
			store.set(
				name,
				node.output(output === DEFAULT_OUTPUT ? undefined : output),
			)
		}
	}

	// wire together named inputs between nodes
	let prevStepId = undefined
	for (const step of steps) {
		const current = graph.node(step.id)

		// If inputs are defined, use those. Otherwise, default to
		// pipelining the graph nodes into each other (e.g. prev node's
		// default output is the default input here)
		const inputRecords =
			Object.keys(step.inputs).length > 0
				? step.inputs
				: defaultStepInput(prevStepId)

		// if any inputs nodes are in the graph, bind them
		for (const [input, binding] of Object.entries(inputRecords)) {
			const { node: sourceId, output } = binding
			const node = graph.hasNode(sourceId)
				? // bind to an input defined in the graph
				  graph.node(sourceId)
				: // bind to a named table observable
				  observableNode(sourceId, store.observe(sourceId))

			current.bind({
				input: input === DEFAULT_INPUT ? undefined : input,
				node,
				output,
			})
			prevStepId = step.id
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

function defaultStepInput(prevId: string | undefined): Step['inputs'] {
	return prevId != null ? { default: { node: prevId } } : (EMPTY as any)
}
