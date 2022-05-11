/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@data-wrangling-components/core'
import { default as guidanceIndex } from '@data-wrangling-components/verb-guidance'
import {
	Callout,
	DirectionalHint,
	IconButton,
	PrimaryButton,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'

import { Guidance } from './Guidance.js'
import { StepSelector } from './StepSelector.js'
import {
	useHandleSaveClick,
	useInternalTableStep,
	useModalStyles,
	useStepOutputHandling,
} from './TableTransformModal.hooks.js'
import {
	ButtonContainer,
	ContainerBody,
	GuidanceContainer,
	Header,
	icons,
	StepComponentContainer,
	StepSelectorContainer,
	Title,
} from './TableTransformModal.styles.js'
import { StepComponent } from './StepComponent.js'
import type { TransformModalProps } from './TableTransformModal.types.js'

export const TableTransformModal: React.FC<TransformModalProps> = memo(
	function TableTransformModal({
		onDismiss,
		graph,
		onTransformRequested,
		index,
		step,
		nextInputTable,
		styles,
		...props
	}) {
		const [showGuidance, { toggle: toggleGuidance }] = useBoolean(false)
		const { internal, setInternal, handleVerbChange } = useInternalTableStep(
			step,
			nextInputTable,
			graph as GraphManager,
		)

		// const StepArgs = useStepArgsComponent(internal, !!step)
		const adaptedStyles = useModalStyles(styles, showGuidance)
		const { output, onOutputChanged } = useStepOutputHandling(graph, step)
		const handleSaveClick = useHandleSaveClick(
			internal,
			output,
			onTransformRequested,
		)

		return (
			<Callout
				onDismissed={() => setInternal(undefined)}
				styles={adaptedStyles}
				directionalHint={DirectionalHint.rightBottomEdge}
				{...props}
			>
				<Header>
					<Title>{step ? 'Edit step' : 'New step'}</Title>
					{onDismiss && (
						<IconButton
							iconProps={icons.cancel}
							ariaLabel="Close popup modal"
							onClick={() => onDismiss()}
						/>
					)}
				</Header>

				<ContainerBody showGuidance={showGuidance}>
					<StepComponentContainer>
						<StepSelectorContainer>
							<StepSelector
								placeholder="Select a verb"
								verb={internal?.verb}
								onCreate={handleVerbChange}
							/>
							{internal?.verb ? (
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
					</StepComponentContainer>
					{showGuidance && internal?.verb ? (
						<GuidanceContainer>
							<Guidance name={internal?.verb} index={guidanceIndex} />
						</GuidanceContainer>
					) : null}
				</ContainerBody>
			</Callout>
		)
	},
)
