/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { VerbContainer } from '../../common'
import { PivotInputs } from '../../controls'
import type { StepComponentProps } from '../../types'

/**
 * Provides inputs for an aggregation step.
 */
export const Pivot: React.FC<StepComponentProps> = memo(function Pivot(props) {
	return (
		<VerbContainer>
			<PivotInputs {...props} />
		</VerbContainer>
	)
})
