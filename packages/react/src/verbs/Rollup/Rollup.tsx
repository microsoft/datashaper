/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { VerbContainer } from '../../common'
import { RollupInputs } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a rollup step.
 */
export const Rollup: React.FC<StepComponentProps> = memo(function Rollup(
	props,
) {
	return (
		<VerbContainer>
			<RollupInputs {...props} />
		</VerbContainer>
	)
})
