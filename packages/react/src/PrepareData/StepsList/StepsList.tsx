/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import React, { memo } from 'react'
import { StepActions } from '../../'
import styled from 'styled-components'

export const StepsList: React.FC<{ steps: Step[] }> = memo(function StepsList({
	steps,
}) {
	return (
		<Container>
			{steps.map((step, index) => {
				return <StepActions key={index} step={step} />
			})}
		</Container>
	)
})

const Container = styled.div``
