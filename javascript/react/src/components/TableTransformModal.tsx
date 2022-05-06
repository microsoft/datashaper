/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@data-wrangling-components/core'
import index from '@data-wrangling-components/verb-guidance'
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
	useStepArgsComponent,
	useInternalTableStep,
	useModalStyles,
	useStepOutputHandling,
} from './TableTransformModal.hooks.js'
import type { TransformModalProps } from './TableTransformModal.types.js'
import {
	icons,
	ContainerBody,
	ButtonContainer,
	GuidanceContainer,
	Header,
	StepComponentContainer,
	StepSelectorContainer,
	Title,
} from './TableTransformModal.styles.js'

export const TableTransformModal: React.FC<TransformModalProps> = memo(
	function TableTransformModal({
		onDismiss,
		graph,
		onTransformRequested,
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

		const StepArgs = useStepArgsComponent(internal, !!step)
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
						{internal && StepArgs && (
							<>
								<StepArgs
									step={internal}
									graph={graph}
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
							<Guidance name={internal?.verb} index={index} />
						</GuidanceContainer>
					) : null}
				</ContainerBody>
			</Callout>
		)
	},
)
