/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { FilterInputs } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Filter step.
 */
export const Filter: React.FC<StepComponentProps> = memo(function Filter(
	props,
) {
	return <FilterInputs {...props} />
})
