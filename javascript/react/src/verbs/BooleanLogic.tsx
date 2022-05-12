/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@data-wrangling-components/core'
import { memo } from 'react'

import { useTableColumnNames, useStepDataTable } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { BooleanLogicBase } from './BooleanLogic.base.js'

/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogic: React.FC<StepComponentProps<BooleanArgs>> = memo(
	function BooleanLogic({ step, graph, input, table, onChange }) {
		const dataTable = useStepDataTable(step, graph, input, table)
		const columns = useTableColumnNames(dataTable)
		return (
			<BooleanLogicBase step={step} onChange={onChange} columns={columns} />
		)
	},
)
