/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { selectStepDescription } from '../selectStepDescription'

export const StepActions: React.FC<{ step: Step }> = memo(function StepActions({
	step,
}) {
	const Description = useMemo(() => selectStepDescription(step), [step])
	return (
		<Container>
			<Description step={step} showInput showOutput />
		</Container>
	)
})

const Container = styled.div`
	padding: 18px;
`
