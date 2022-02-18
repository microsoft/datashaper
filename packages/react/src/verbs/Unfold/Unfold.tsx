/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { VerbContainer } from '../../common'
import { UnfoldInputs } from '../../controls'
import type { StepComponentProps } from '../../types'

/**
 * Provides inputs for an aggregation step.
 */
export const Unfold: React.FC<StepComponentProps> = memo(function Unfold(
	props,
) {
	return (
		<VerbContainer>
			<UnfoldInputs {...props} />
		</VerbContainer>
	)
})
