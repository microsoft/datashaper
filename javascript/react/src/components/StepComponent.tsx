/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import flow from 'lodash-es/flow.js'
import { memo, useCallback, useMemo } from 'react'

import {
	withInputColumnDropdown,
	withInputTableDropdown,
	withOutputColumnTextfield,
} from '../hocs/index.js'
import { selectStepComponent } from '../selectStepComponent.js'
import { selectStepDescription } from '../selectStepDescription.js'
import type { StepComponentProps as RealStepComponentProps } from '../types.js'
import { Container, DescriptionContainer } from './StepComponent.styles.js'
import type { StepComponentProps } from './StepComponent.types.js'

/**
 * Let's us render the Steps in a loop while memoing all the functions
 */
export const StepComponent: React.FC<StepComponentProps> = memo(
	function StepComponent({
		step,
		output,
		graph,
		index,
		onChange,
		onChangeOutput,
	}) {
		const Component = useMemo(() => selectStepComponent(step), [step])
		const Description = useMemo(() => selectStepDescription(step), [step])
		const WithAllArgs = useMemo<React.ComponentType<RealStepComponentProps>>(
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
				<WithAllArgs
					step={step}
					graph={graph}
					output={output}
					onChange={handleStepChange}
					onChangeOutput={onChangeOutput}
				/>
				<DescriptionContainer>
					<Description
						step={step}
						output={output}
						showInput
						showOutput
						showOutputColumn
					/>
				</DescriptionContainer>
			</Container>
		)
	},
)
