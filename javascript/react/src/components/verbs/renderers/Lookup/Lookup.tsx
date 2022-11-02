/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { LookupArgs } from '@datashaper/schema'
import { NodeInput } from '@datashaper/workflow'
import { memo } from 'react'

import {
	useColumnNames,
	useTableDropdownOptions,
	useWorkflowDataTable,
} from '../../../../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { LookupBase } from './Lookup.base.js'

/**
 * Provides inputs for a Lookup step.
 */
export const Lookup: React.FC<StepComponentProps<LookupArgs>> = memo(
	function Lookup({ step, workflow, onChange }) {
		const leftTable = useWorkflowDataTable(
			step.input[NodeInput.Source]?.node,
			workflow,
		)
		const rightTable = useWorkflowDataTable(
			step.input[NodeInput.Other]?.node,

			workflow,
		)
		const tableOptions = useTableDropdownOptions(workflow)
		const leftColumns = useColumnNames(leftTable)
		const rightColumns = useColumnNames(rightTable)
		return (
			<LookupBase
				step={step}
				onChange={onChange}
				tableOptions={tableOptions}
				leftColumns={leftColumns}
				rightColumns={rightColumns}
			/>
		)
	},
)
