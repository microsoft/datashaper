/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { VerbContainer } from '../../common'
import { AggregateInputs } from '../../controls'
import { StepComponentProps } from '../../types'

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
