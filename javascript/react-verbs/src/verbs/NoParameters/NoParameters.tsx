/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { StepComponentProps } from '@data-wrangling-components/react-types'

/**
 * Provides inputs for an ungroup step.
 */
export const NoParameters: React.FC<StepComponentProps<void>> = memo(
	function NoParameters() {
		return null
	},
)
