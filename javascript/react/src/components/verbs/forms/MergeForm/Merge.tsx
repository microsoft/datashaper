/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { MergeFormBase } from './Merge.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const MergeForm: React.FC<StepFormProps<MergeArgs>> = memo(
	function MergeForm({ step, onChange }) {
		return <MergeFormBase step={step} onChange={onChange} />
	},
)
