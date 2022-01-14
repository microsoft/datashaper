/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableStore } from '@data-wrangling-components/core'

import {
	withTableDropdown,
	selectStepComponent,
	selectStepDescription,
} from '@data-wrangling-components/react'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

export interface StepComponentProps {
	step: Step
	store: TableStore
	index: number
	onChange: (step: Step, index: number) => void
}

/**
 * Let's us render the Steps in a loop while memoing all the functions
 */
export const StepComponent: React.FC<StepComponentProps> = memo(
	function StepComponent({ step, store, index, onChange }) {
		const Component = useMemo(() => selectStepComponent(step), [step])
		const Description = useMemo(() => selectStepDescription(step), [step])
		const WithTableDropdown = useMemo(
			() => withTableDropdown()(Component),
			[Component],
		)
		const handleStepChange = useCallback(
			step => onChange(step, index),
			[index, onChange],
		)
		return (
			<>
				{' '}
				<WithTableDropdown
					step={step}
					store={store}
					onChange={handleStepChange}
				/>
				{Description ? (
					<DescriptionContainer>
						<Description step={step} showInput showOutput />
					</DescriptionContainer>
				) : null}
			</>
		)
	},
)

const DescriptionContainer = styled.div`
	margin-top: 8px;
`
