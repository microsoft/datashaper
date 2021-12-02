/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { FilterInputs } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Filter step.
 */
export const Filter: React.FC<StepComponentProps> = memo(function Filter({
	step,
	store,
	onChange,
}) {
	return (
		<Container>
			<FilterInputs step={step} store={store} onChange={onChange} />
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
