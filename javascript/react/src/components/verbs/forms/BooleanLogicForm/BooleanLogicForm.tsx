/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { BooleanLogicFormBase } from './BooleanLogicForm.base.js'

/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogicForm: React.FC<StepFormProps<BooleanArgs>> = memo(
	function BooleanLogicForm({ step, onChange }) {
		return <BooleanLogicFormBase step={step} onChange={onChange} />
	},
)
