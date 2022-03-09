/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { StepComponentProps } from '../../types.js'
import { FilterInputs } from '../shared/index.js'

/**
 * Provides inputs for a Filter step.
 */
export const Filter: React.FC<StepComponentProps> = memo(function Filter(
	props,
) {
	return <FilterInputs {...props} />
})
