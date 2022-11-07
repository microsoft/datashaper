/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useColumnNames, useStepDataTable } from '../../../../hooks/index.js'
import type { StepFormProps } from '../types.js'
import { PivotFormBase } from './PivotForm.base.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const PivotForm: React.FC<StepFormProps<PivotArgs>> = memo(
	function PivotForm({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const columns = useColumnNames(dataTable)

		return <PivotFormBase step={step} onChange={onChange} columns={columns} />
	},
)
