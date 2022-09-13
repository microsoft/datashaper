/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@datashaper/schema'
import { memo } from 'react'

import {
	useColumnsMetadata,
	useStepDataTable,
	useTableColumnNames,
} from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { ConvertBase } from './Convert.base.js'

/**
 * Provides inputs for a Convert step.
 */
export const Convert: React.FC<StepComponentProps<ConvertArgs>> = memo(
	function Convert({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const columns = useTableColumnNames(dataTable)
		// TODO: replace this with introspect
		const fields = useColumnsMetadata(dataTable)
		return (
			<ConvertBase
				columns={columns}
				step={step}
				onChange={onChange}
				fields={fields}
			/>
		)
	},
)
