/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'

import { GraphWorkflow } from './GraphWorkflow.js'
import type { WorkflowObject } from './types.js'

/**
 * This function establishes the reactive processing graph for executing transformation steps.
 *
 * A graph is constructed using each step definition as a node. Any table definitions they export
 * are registered into the tableContainer. Any inputs that are defined but not accounted for in the
 * graph will be wired to the TableContainer using the observable pattern.
 *
 * @param steps - The processing steps
 * @param tables - The fixed table map
 * @returns The built reactive processing graph
 */
export function createGraph(
	workflow: WorkflowObject,
	tables: Map<string, TableContainer>,
): GraphWorkflow {
	const graph = new GraphWorkflow(workflow)
	graph.inputs = tables
	return graph
}
