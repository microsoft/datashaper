/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StepComponentProps } from '../types.js'
import { memo } from 'react'

/**
 * Provides inputs for an ungroup step.
 */
export const NoParameters: React.FC<StepComponentProps<void>> = memo(
	function NoParameters() {
		return null
	},
)
