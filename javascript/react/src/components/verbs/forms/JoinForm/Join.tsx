/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputBinding, JoinArgs, WorkflowStepId } from '@datashaper/schema'
import { NodeInput } from '@datashaper/workflow'
import { memo } from 'react'

import {
	useColumnNames,
	useTableDropdownOptions,
	useWorkflowDataTable,
} from '../../../../hooks/index.js'
import type { StepFormProps } from '../types.js'
import { JoinFormBase } from './Join.base.js'

/**
 * Provides inputs for a Join step.
 */
export const JoinForm: React.FC<StepFormProps<JoinArgs>> = memo(
	function JoinForm({ step, workflow, input, onChange }) {
		const tableOptions = useTableDropdownOptions(workflow)

		const leftTable = useWorkflowDataTable(
			input || (step.input[NodeInput.Source] as InputBinding).node,
			workflow,
		)
		const rightTable = useWorkflowDataTable(
			(step.input[NodeInput.Other] as InputBinding).node as WorkflowStepId,
			workflow,
		)
		const leftColumns = useColumnNames(leftTable)
		const rightColumns = useColumnNames(rightTable)

		return (
			<JoinFormBase
				step={step}
				onChange={onChange}
				tableOptions={tableOptions}
				leftColumns={leftColumns}
				rightColumns={rightColumns}
			/>
		)
	},
)
