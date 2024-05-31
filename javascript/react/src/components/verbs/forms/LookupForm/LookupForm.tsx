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
	useWorkflowInput,
} from '../../../../hooks/index.js'
import { getInputNode } from '../../../../util.js'
import type { StepFormProps } from '../types.js'
import { LookupFormBase } from './LookupForm.base.js'

/**
 * Provides inputs for a Lookup step.
 */
export const LookupForm: React.FC<StepFormProps<LookupArgs>> = memo(
	function LookupForm({ step, workflow, onChange }) {
		const input = useWorkflowInput(workflow)
		const tableOptions = useTableDropdownOptions(
			workflow,
			(name) => name !== input?.id,
		)

		const leftTable = useWorkflowDataTable(
			getInputNode(step, NodeInput.Source),
			workflow,
		)
		const rightTable = useWorkflowDataTable(
			getInputNode(step, NodeInput.Other),
			workflow,
		)

		const leftColumns = useColumnNames(leftTable)
		const rightColumns = useColumnNames(rightTable)
		return (
			<LookupFormBase
				step={step}
				onChange={onChange}
				tableOptions={tableOptions}
				leftColumns={leftColumns}
				rightColumns={rightColumns}
			/>
		)
	},
)
