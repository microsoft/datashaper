/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { SpreadFormBase } from './SpreadForm.base.js'

export const SpreadForm: React.FC<StepFormProps<SpreadArgs>> = memo(
	function SpreadForm({ step, onChange }) {
		return <SpreadFormBase step={step} onChange={onChange} />
	},
)
