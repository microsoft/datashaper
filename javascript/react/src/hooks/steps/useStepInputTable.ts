/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, Workflow } from '@datashaper/workflow'
import { NodeInput } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { getInputNode } from '../../util.js'
import { useWorkflowDataTable } from '../index.js'

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
): ColumnTable | undefined {
	const id = input || getInputNode(step, NodeInput.Source)
	const result = useWorkflowDataTable(id, workflow)
	return result
}
