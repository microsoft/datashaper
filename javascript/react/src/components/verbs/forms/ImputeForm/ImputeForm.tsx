/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ImputeArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { ImportFormBase } from './ImputeForm.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const ImputeForm: React.FC<StepFormProps<ImputeArgs>> = memo(
	function ImputeForm({ step, onChange }) {
		return <ImportFormBase step={step} onChange={onChange} />
	},
)
