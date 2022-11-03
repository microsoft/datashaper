/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '@datashaper/schema'
import type { Workflow } from '@datashaper/workflow'
import { ActionButton, IconButton } from '@fluentui/react'
import { isEqual } from 'lodash-es'
import { memo, useCallback, useMemo } from 'react'

import { StepForm } from '../StepForm/StepForm.js'
import {
	useHandleSaveClick,
	useInternalTableStep,
	useStepOutputHandling,
} from './StepListItem.hooks.js'
import {
	ButtonContainer,
	Container,
	Flex,
	icons,
	rightButtonStyles,
	SaveButtonWrapper,
	StepSelectorContainer,
} from './StepListItem.styles.js'
import type { StepStackItemProps } from './StepListItem.types.js'
import { StepSelector } from './StepSelector.js'

export const StepStackItem: React.FC<StepStackItemProps> = memo(
	function StepStackItem({
		workflow,
		onSave,
		metadata,
		index,
		step,
		showGuidance,
		showGuidanceButton,
		toggleGuidance,
		onVerbChange,
		style = {},
		hideStepSelector,
		onDelete,
		hideInputColumn,
	}) {
		const { internal, setInternal, handleVerbChange } = useInternalTableStep(
			step,
			workflow as Workflow,
		)
		const { output, outputHasChanged, onOutputChanged } = useStepOutputHandling(
			workflow,
			step,
		)
		const handleSaveClick = useHandleSaveClick(internal, onSave)
		const onCreate = useCallback(
			(verb: Verb) => {
				onVerbChange?.(verb)
				handleVerbChange(verb)
			},
			[handleVerbChange, onVerbChange],
		)

		const disableSave = useMemo<boolean>(
			() => isEqual(step, internal) && !outputHasChanged,
			[step, internal, outputHasChanged],
		)

		return (
			<Container style={style}>
				{hideStepSelector && showGuidanceButton && internal?.verb ? (
					<IconButton
						onClick={toggleGuidance}
						iconProps={icons.info}
						checked={showGuidance}
						styles={rightButtonStyles}
					/>
				) : null}
				{!hideStepSelector ? (
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
				) : null}
				{internal && (
					<>
						<StepForm
							step={internal}
							workflow={workflow}
							metadata={metadata}
							index={index}
							output={output}
							onChangeOutput={onOutputChanged}
							onChange={setInternal}
							hideInputColumn={hideInputColumn}
						/>
						<ButtonContainer>
							<Flex>
								<SaveButtonWrapper>
									{handleSaveClick ? (
										<ActionButton
											onClick={handleSaveClick}
											iconProps={icons.checkMark}
											disabled={disableSave}
										>
											Save
										</ActionButton>
									) : null}
								</SaveButtonWrapper>
							</Flex>
							{onDelete ? (
								<ActionButton onClick={onDelete} iconProps={icons.delete}>
									Delete
								</ActionButton>
							) : null}
						</ButtonContainer>
					</>
				)}
			</Container>
		)
	},
)
