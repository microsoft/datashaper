/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CopyArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { CopyFormBase } from './Copy.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const CopyForm: React.FC<StepFormProps<CopyArgs>> = memo(
	function CopyForm({ step, onChange }) {
		return <CopyFormBase step={step} onChange={onChange} />
	},
)
