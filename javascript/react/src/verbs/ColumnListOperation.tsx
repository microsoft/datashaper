/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useStepDataTable, useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { ColumnListOperationBase } from './ColumnListOperation.base.js'
/**
 * Provides inputs for a ColumnListOperation step.
 */
export const ColumnListOperation: React.FC<
	StepComponentProps<InputColumnListArgs>
> = memo(function ColumnListOperation({
	step,
	workflow,
	input,
	table,
	onChange,
}) {
	const dataTable = useStepDataTable(step, workflow, input, table)
	const columns = useTableColumnNames(dataTable)

	return (
		<ColumnListOperationBase
			step={step}
			onChange={onChange}
			columns={columns}
		/>
	)
})
