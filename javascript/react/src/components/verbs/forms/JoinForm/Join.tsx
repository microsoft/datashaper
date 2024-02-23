/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@datashaper/schema'
import { NodeInput } from '@datashaper/workflow'
import { memo } from 'react'

import {
	useColumnNames,
	useTableDropdownOptions,
	useWorkflowDataTable,
	useWorkflowInput,
} from '../../../../hooks/index.js'
import type { StepFormProps } from '../types.js'
import { JoinFormBase } from './Join.base.js'
import { getInputNode } from '../../../../util.js'

/**
 * Provides inputs for a Join step.
 */
export const JoinForm: React.FC<StepFormProps<JoinArgs>> = memo(
	function JoinForm({ step, workflow, onChange }) {
		
		const input = useWorkflowInput(workflow)
		const tableOptions = useTableDropdownOptions(workflow, (name) => name !== input?.id)

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
