/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, Workflow } from '@datashaper/workflow'
import { NodeInput } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { useWorkflowDataTable } from '../index.js'

export function useStepDataTable(
	step: Step,
	workflow: Workflow | undefined,
	input?: string | undefined,
	table?: ColumnTable | undefined,
): ColumnTable | undefined {
	return useWorkflowDataTable(
		input || step.input[NodeInput.Source]?.node,
		workflow,
		table,
	)
}
