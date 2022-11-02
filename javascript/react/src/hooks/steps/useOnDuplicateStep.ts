/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import { cloneStep } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import { useSuggestedTableName } from '../tables/useSuggestedTableName.js'

export function useOnDuplicateStep(
	workflow: Workflow,
	table?: ColumnTable,
	onSave?: (step: Step, output: string | undefined, index?: number) => void,
): (_step: Step) => void {
	const createTableName = useSuggestedTableName(workflow)

	return useCallback(
		(step: Step) => {
			const outputTable = table ?? workflow?.read(step.id)?.table
			const clonedStep = cloneStep(step, outputTable?.columnNames())
			clonedStep.id = ''
			onSave?.(clonedStep, createTableName(step.id))
		},
		[onSave, workflow, table, createTableName],
	)
}
