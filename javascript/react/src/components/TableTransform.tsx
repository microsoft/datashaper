/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '@datashaper/schema'
import type { Workflow } from '@datashaper/workflow'
import { ActionButton, IconButton } from '@fluentui/react'
import { isEqual } from 'lodash-es'
import React, { memo, useCallback, useMemo } from 'react'

import { StepComponent } from './StepComponent.js'
import { StepSelector } from './StepSelector.js'
import {
	useHandleSaveClick,
	useInternalTableStep,
	useStepOutputHandling,
} from './TableTransform.hooks.js'
import {
	ButtonContainer,
	Container,
	Flex,
	icons,
	rightButtonStyles,
	SaveButtonWrapper,
	StepSelectorContainer,
} from './TableTransform.styles.js'
import type { TableTransformProps } from './TableTransform.types.js'

export const TableTransform: React.FC<TableTransformProps> = memo(
	function TableTransform({
		workflow,
		onTransformRequested,
		index,
		step,
		showGuidance,
		showGuidanceButton,
		toggleGuidance,
		onVerbChange,
		style = {},
		hideStepSelector,
		onDelete,
		hideInput,
		hideOutput,
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
		const handleSaveClick = useHandleSaveClick(
			internal,
			output,
			onTransformRequested,
		)
		const onCreate = useCallback(
			(verb: Verb) => {
				onVerbChange?.(verb)
				handleVerbChange(verb)
			},
			[handleVerbChange, onVerbChange],
		)

		const disableSave = useMemo((): boolean => {
			return isEqual(step, internal) && !hideOutput && !outputHasChanged
		}, [step, internal, outputHasChanged, hideOutput])

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
						<StepComponent
							step={internal}
							workflow={workflow}
							index={index}
							output={output}
							onChangeOutput={onOutputChanged}
							onChange={setInternal}
							hideInput={hideInput}
							hideOutput={hideOutput}
							hideInputColumn={hideInputColumn}
						/>
						<ButtonContainer>
							<Flex>
								<SaveButtonWrapper>
									<ActionButton
										onClick={handleSaveClick}
										iconProps={icons.checkMark}
										disabled={disableSave}
									>
										Save
									</ActionButton>
								</SaveButtonWrapper>
							</Flex>
							{onDelete ? (
								<IconButton
									onClick={() => onDelete(index)}
									iconProps={icons.delete}
								/>
							) : null}
						</ButtonContainer>
					</>
				)}
			</Container>
		)
	},
)
