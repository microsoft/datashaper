/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '@datashaper/schema'
import type { Step, Workflow } from '@datashaper/workflow'
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
	deleteButtonStyles,
	icons,
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
		nextInputTable,
		showGuidance,
		showGuidanceButton,
		toggleGuidance,
		onVerbChange,
		style = {},
		hideStepSelector,
		onDelete,
		onDuplicate,
		onPreview,
		hideInput,
		hideOutput,
		hideInputColumn,
	}) {
		const { internal, setInternal, handleVerbChange } = useInternalTableStep(
			step,
			nextInputTable,
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
		}, [step, internal, outputHasChanged])

		return (
			<Container style={style}>
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
							{onPreview ? (
								<IconButton
									onClick={() => onPreview(step?.id as string)}
									iconProps={icons.preview}
								/>
							) : null}
							{onDuplicate ? (
								<IconButton
									onClick={() => onDuplicate(step as Step)}
									iconProps={icons.duplicate}
								/>
							) : null}
							<SaveButtonWrapper>
								<ActionButton
									onClick={handleSaveClick}
									iconProps={icons.checkMark}
									disabled={disableSave}
								>
									Save
								</ActionButton>
							</SaveButtonWrapper>
							{onDelete ? (
								<IconButton
									onClick={() => onDelete(index)}
									iconProps={icons.delete}
									styles={deleteButtonStyles}
								/>
							) : null}
						</ButtonContainer>
					</>
				)}
			</Container>
		)
	},
)
