/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnhotArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useStepDataTable, useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { UnhotBase } from './Unhot.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Unhot: React.FC<StepComponentProps<UnhotArgs>> = memo(
	function Unhot({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const columnNames = useTableColumnNames(dataTable)
		return <UnhotBase step={step} onChange={onChange} columns={columnNames} />
	},
)
