/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useColumnNames, useStepInputTable } from '../../../../hooks/index.js'
import type { StepFormProps } from '../types.js'
import { AggregateFormBase } from './AggregateForm.base.js'

/*
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const AggregateForm: React.FC<StepFormProps<AggregateArgs>> = memo(
	function Aggregate({ step, workflow, input, table, onChange }) {
		const dataTable = useStepInputTable(step, workflow, input, table)
		const columns = useColumnNames(dataTable)
		return (
			<AggregateFormBase columns={columns} step={step} onChange={onChange} />
		)
	},
)
