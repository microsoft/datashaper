/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useColumnNames, useStepDataTable } from '../../../../hooks/index.js'
import type { StepComponentProps } from '../../../../types.js'
import { AggregateBase } from './Aggregate.base.js'

/*
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Aggregate: React.FC<StepComponentProps<AggregateArgs>> = memo(
	function Aggregate({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const columns = useColumnNames(dataTable)
		return <AggregateBase columns={columns} step={step} onChange={onChange} />
	},
)
