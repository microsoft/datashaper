/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Verb } from '@datashaper/core'
import { IconButton, PrimaryButton } from '@fluentui/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'

import { StepComponent } from './StepComponent.js'
import { StepSelector } from './StepSelector.js'
import {
	useHandleSaveClick,
	useInternalTableStep,
	useStepOutputHandling,
} from './TableTransform.hooks.js'
import {
	ButtonContainer,
	icons,
	StepSelectorContainer,
} from './TableTransform.styles.js'
import type { TableTransformProps } from './TableTransform.types.js'

export const TableTransform: React.FC<TableTransformProps> = memo(
	function TableTransform({
		graph,
		onTransformRequested,
		index,
		step,
		nextInputTable,
		showGuidance,
		showGuidanceButton,
		toggleGuidance,
		onVerbChange,
	}) {
		const { internal, setInternal, handleVerbChange } = useInternalTableStep(
			step,
			nextInputTable,
			graph as GraphManager,
		)
		const { output, onOutputChanged } = useStepOutputHandling(graph, step)
		const handleSaveClick = useHandleSaveClick(
			internal,
			output,
			onTransformRequested,
		)
		const onCreate = useCallback(
			(verb: Verb) => {
				onVerbChange(verb)
				handleVerbChange(verb)
			},
			[handleVerbChange, onVerbChange],
		)

		return (
			<Container>
				<StepSelectorContainer>
					<StepSelector
						placeholder="Select a verb"
						verb={internal?.verb}
						onCreate={onCreate}
					/>
					{showGuidanceButton && internal?.verb ? (
						<IconButton
							onClick={toggleGuidance}
							iconProps={icons.info}
							checked={showGuidance}
						/>
					) : null}
				</StepSelectorContainer>
				{internal && (
					<>
						<StepComponent
							step={internal}
							graph={graph}
							index={index}
							output={output}
							onChangeOutput={onOutputChanged}
							onChange={setInternal}
						/>
						<ButtonContainer>
							<PrimaryButton onClick={handleSaveClick}>Save</PrimaryButton>
						</ButtonContainer>
					</>
				)}
			</Container>
		)
	},
)

const Container = styled.div``
