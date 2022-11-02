/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnfoldArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useStepDataTable, useTableColumnNames } from '../../hooks/index.js'
import type { StepComponentProps } from '../../types.js'
import { UnfoldBase } from './Unfold.base.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Unfold: React.FC<StepComponentProps<UnfoldArgs>> = memo(
	function Unfold({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const columns = useTableColumnNames(dataTable)
		return <UnfoldBase step={step} onChange={onChange} columns={columns} />
	},
)
