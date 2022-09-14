/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableContainer } from '@datashaper/tables'
import type { Step, Workflow } from '@datashaper/workflow'

export interface TableCommandsProps {
	inputTable: TableContainer | undefined
	workflow: Workflow
	selectedColumn?: string
	onAddStep?: (
		step: Step,
		output: string | undefined,
		index: number | undefined,
	) => void
}
