/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { LeftAlignedRow, VerbContainer } from '../../common'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for an unourder step.
 */
export const Unorder: React.FC<StepComponentProps> = memo(function Unorder({
	step,
	store,
	table,
	onChange,
}) {
	return (
		<VerbContainer>
			<LeftAlignedRow></LeftAlignedRow>
		</VerbContainer>
	)
})
