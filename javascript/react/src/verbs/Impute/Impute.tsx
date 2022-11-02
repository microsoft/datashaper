/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ImputeArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepComponentProps } from '../../types.js'
import { ImputeBase } from './Impute.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Impute: React.FC<StepComponentProps<ImputeArgs>> = memo(
	function Impute({ step, onChange }) {
		return <ImputeBase step={step} onChange={onChange} />
	},
)
