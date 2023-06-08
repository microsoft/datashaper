/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, Workflow } from '@datashaper/workflow'
import { NodeInput } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { useWorkflowDataTable } from '../index.js'
import { type WorkflowStepId } from '@datashaper/schema'

/**
 * Use an input table for a step
 * @param step - The step to read input for
 * @param workflow - The workflow
 * @param input - The optional input name
 * @param table - The optional initial value
 * @returns
 */
export function useStepInputTable(
	step: Step,
	workflow: Workflow | undefined,
	input?: string | undefined,
	table?: ColumnTable | undefined,
): ColumnTable | undefined {
	const id = input || step.input[NodeInput.Source] as WorkflowStepId
	const result = useWorkflowDataTable(id, workflow, table)
	return result
}
