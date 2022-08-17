/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useStepDataTable } from '../hooks/useStepDataTable.js'
import { useTableColumnNames } from '../hooks/useTableColumnNames.js'
import type { StepComponentProps } from '../types.js'
import { SpreadBase } from './Spread.base.js'

export const Spread: React.FC<StepComponentProps<SpreadArgs>> = memo(
	function Spread({ step, graph, input, table, onChange }) {
		const dataTable = useStepDataTable(step, graph, input, table)
		const columns = useTableColumnNames(dataTable)
		return <SpreadBase step={step} onChange={onChange} columns={columns} />
	},
)
