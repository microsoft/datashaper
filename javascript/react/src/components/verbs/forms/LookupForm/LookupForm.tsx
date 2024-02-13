/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputBinding, LookupArgs } from '@datashaper/schema'
import { NodeInput } from '@datashaper/workflow'
import { memo } from 'react'

import {
	useColumnNames,
	useTableDropdownOptions,
	useWorkflowDataTable,
} from '../../../../hooks/index.js'
import type { StepFormProps } from '../types.js'
import { LookupFormBase } from './LookupForm.base.js'

/**
 * Provides inputs for a Lookup step.
 */
export const LookupForm: React.FC<StepFormProps<LookupArgs>> = memo(
	function LookupForm({ step, workflow, onChange }) {
		const leftTable = useWorkflowDataTable(
			(step.input[NodeInput.Source] as InputBinding).node,
			workflow,
		)
		const rightTable = useWorkflowDataTable(
			(step.input[NodeInput.Other] as InputBinding).node,
			workflow,
		)
		const tableOptions = useTableDropdownOptions(workflow)
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
