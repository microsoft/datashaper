/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { StepFormProps } from '../types.js'

/**
 * Provides inputs for an ungroup step.
 */
export const NoParametersFormBase: React.FC<StepFormProps<void>> = memo(
	function NoParametersFormBase() {
		return null
	},
)
