/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnfoldArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useColumnNames, useStepDataTable } from '../../../../hooks/index.js'
import type { StepFormProps } from '../types.js'
import { UnfoldFormBase } from './UnfoldForm.base.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const UnfoldForm: React.FC<StepFormProps<UnfoldArgs>> = memo(
	function UnfoldForm({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const columns = useColumnNames(dataTable)
		return <UnfoldFormBase step={step} onChange={onChange} columns={columns} />
	},
)
