/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@data-wrangling-components/core'
import { memo } from 'react'

import { useStepDataTable,useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { ConvertBase } from './Convert.base.js'

/**
 * Provides inputs for a Convert step.
 */
export const Convert: React.FC<StepComponentProps<ConvertArgs>> = memo(
	function Convert({ step, graph, input, table, onChange }) {
		const dataTable = useStepDataTable(step, graph, input, table)
		const columns = useTableColumnNames(dataTable)
		return <ConvertBase columns={columns} step={step} onChange={onChange} />
	},
)
