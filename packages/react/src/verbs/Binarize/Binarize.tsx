/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { FilterInputs } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Binarize step.
 */
export const Binarize: React.FC<StepComponentProps> = memo(function Binarize(
	props,
) {
	return (
		<Container>
			<FilterInputs {...props} />
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
