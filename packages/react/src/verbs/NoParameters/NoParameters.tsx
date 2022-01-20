/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for an ungroup step.
 */
export const NoParameters: React.FC<StepComponentProps> = memo(
	function NoParameters() {
		return null
	},
)
