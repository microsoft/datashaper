/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, GraphManager } from '@data-wrangling-components/core'
import {
	withInputColumnDropdown,
	withInputTableDropdown,
	withOutputColumnTextfield,
} from '@data-wrangling-components/react-hocs'
import flow from 'lodash-es/flow.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { selectStepComponent, selectStepDescription } from '../../index.js'

interface StepComponentProps {
	step: Step
	graph: GraphManager
	index: number
	onChange: (step: Step, index: number) => void
}

/**
 * Let's us render the Steps in a loop while memoing all the functions
 */
export const StepComponent: React.FC<StepComponentProps> = memo(
	function StepComponent({ step, graph, index, onChange }) {
		const Component = useMemo(() => selectStepComponent(step), [step])
		const Description = useMemo(() => selectStepDescription(step), [step])
		const WithAllArgs = useMemo(
			() =>
				flow(
					withInputColumnDropdown(),
					withOutputColumnTextfield(),
					withInputTableDropdown(),
				)(Component),
			[Component],
		)
		const handleStepChange = useCallback(
			(step: Step) => onChange(step, index),
			[index, onChange],
		)
		return (
			<Container className="step-component">
				<WithAllArgs step={step} graph={graph} onChange={handleStepChange} />
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
