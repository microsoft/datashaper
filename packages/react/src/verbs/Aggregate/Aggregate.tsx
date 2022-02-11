/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { VerbContainer } from '../../common/index.js'
import { AggregateInputs } from '../../controls/index.js'
import { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for an aggregation step.
 */
export const Aggregate: React.FC<StepComponentProps> = memo(function Aggregate(
	props,
) {
	return (
		<VerbContainer>
			<AggregateInputs {...props} />
		</VerbContainer>
	)
})
