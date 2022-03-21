/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableStore } from '@data-wrangling-components/core'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import {
	selectStepComponent,
	selectStepDescription,
	withInputColumnDropdown,
	withInputTableDropdown,
	withOutputColumnTextfield,
} from '../../index.js'

interface StepComponentProps {
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
		const WithAllArgs = useMemo(
			() =>
				// TODO: compose cleanly
				withInputTableDropdown()(
					withOutputColumnTextfield()(withInputColumnDropdown()(Component)),
				),
			[Component],
		)
		const handleStepChange = useCallback(
			step => onChange(step, index),
			[index, onChange],
		)
		return (
			<Container className="step-component">
				<WithAllArgs step={step} store={store} onChange={handleStepChange} />
				<DescriptionContainer>
					<Description step={step} showInput showOutput showOutputColumn />
				</DescriptionContainer>
			</Container>
		)
	},
)

const Container = styled.div`
	width: 100%;
	display: flex;
	gap: 36px;
`

const DescriptionContainer = styled.div`
	margin-top: 8px;
`
