/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useStepDataTable, useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { BooleanLogicBase } from './BooleanLogic.base.js'

/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogic: React.FC<StepComponentProps<BooleanArgs>> = memo(
	function BooleanLogic({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const columns = useTableColumnNames(dataTable)
		return (
			<BooleanLogicBase step={step} onChange={onChange} columns={columns} />
		)
	},
)
