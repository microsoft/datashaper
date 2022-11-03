/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnhotArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { UnhotFormBase } from './UnhotForm.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const UnhotForm: React.FC<StepFormProps<UnhotArgs>> = memo(
	function UnhotForm({ step, onChange }) {
		return <UnhotFormBase step={step} onChange={onChange} />
	},
)
