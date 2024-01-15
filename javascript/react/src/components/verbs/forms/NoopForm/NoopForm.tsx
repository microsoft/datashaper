/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NoopArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { NoopFormBase } from './NoopForm.base.js'

/**
 * Just the to/value inputs for an erase.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const NoopForm: React.FC<StepFormProps<NoopArgs>> = memo(
	function NoopForm({ step, onChange }) {
		return <NoopFormBase step={step} onChange={onChange} />
	},
)
