/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowSchema } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'

import { Workflow } from '../resources/Workflow.js'

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
export async function createWorkflow(
	input: WorkflowSchema,
	tables: TableContainer[],
): Promise<Workflow> {
	const wf = new Workflow(input)
	await wf.initializate()
	wf.addInputTables(tables)
	return wf
}
