/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useStepDataTable, useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { OneHotBase } from './OneHot.base.js'

export const OneHot: React.FC<StepComponentProps<OnehotArgs>> = memo(
	function OneHot({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const columns = useTableColumnNames(dataTable)
		return <OneHotBase step={step} onChange={onChange} columns={columns} />
	},
)
