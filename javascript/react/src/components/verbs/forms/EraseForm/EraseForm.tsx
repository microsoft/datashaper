/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { EraseFormBase } from './EraseForm.base.js'

/**
 * Just the to/value inputs for an erase.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const EraseForm: React.FC<StepFormProps<EraseArgs>> = memo(
	function EraseForm({ step, onChange }) {
		return <EraseFormBase step={step} onChange={onChange} />
	},
)
