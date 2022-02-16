/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { VerbContainer } from '../../common'
import { SpreadInputs } from '../../controls'
import type { StepComponentProps } from '../../types'

/**
 * Provides inputs for an aggregation step.
 */
export const Spread: React.FC<StepComponentProps> = memo(function Spread(
	props,
) {
	return (
		<VerbContainer>
			<SpreadInputs {...props} />
		</VerbContainer>
	)
})
