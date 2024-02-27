/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, VerbForm } from '../forms/index.js'
import type { StepFormProps } from '../types.js'

/**
 * Currently, just a stub placeholder
 */
export const WorkflowFormBase: React.FC<StepFormProps<WorkflowArgs>> = memo(
	function WorkflowFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<WorkflowArgs>[]>(() => [], [])
		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)
