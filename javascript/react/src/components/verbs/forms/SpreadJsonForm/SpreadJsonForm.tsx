/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadJsonArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { SpreadJsonFormBase } from './SpreadJsonForm.base.js'

/**
 * Just the json object inputs for spread json.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const SpreadJsonForm: React.FC<StepFormProps<SpreadJsonArgs>> = memo(
	function SpreadJsonForm({ step, onChange }) {
		return <SpreadJsonFormBase step={step} onChange={onChange} />
	},
)
