/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DestructureArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { DestructureFormBase } from './DestructureForm.base.js'

/**
 * Just the json object inputs for spread json.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const DestructureForm: React.FC<StepFormProps<DestructureArgs>> = memo(
	function DestructureForm({ step, onChange }) {
		return <DestructureFormBase step={step} onChange={onChange} />
	},
)
