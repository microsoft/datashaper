/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import type { Graph } from '@essex/dataflow'

import type { ParsedSpecification } from '../steps/types.js'
import type { Store } from '../store/types.js'
import { createGraphBuilder } from './GraphBuilder.js'

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
	const builder = createGraphBuilder(store)
	for (const i of input.values()) {
		builder.addInput(i)
	}
	for (const step of steps) {
		builder.addStep(step)
	}
	for (const [key, value] of output.entries()) {
		builder.addOutput(key, value)
	}

	return builder.graph
}
