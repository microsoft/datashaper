/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, IconButton } from '@fluentui/react'
import { isEqual } from 'lodash-es'
import { memo, useMemo } from 'react'

import { EMPTY_OBJECT } from '../../empty.js'
import { StepForm } from '../StepForm/StepForm.js'
import {
	useHandleSaveClick,
	useInternalTableStep,
	useStepOutputHandling,
} from './StepEditor.hooks.js'
import {
	ButtonContainer,
	Container,
	Flex,
	icons,
	rightButtonStyles,
	SaveButtonWrapper,
} from './StepEditor.styles.js'
import type { StepEditorProps } from './StepEditor.types.js'

export const StepEditor: React.FC<StepEditorProps> = memo(function StepEditor({
	workflow,
	onSave,
	metadata,
	index,
	step,
	showGuidance,
	showGuidanceButton,
	toggleGuidance,
	style = EMPTY_OBJECT,
	onDelete,
	hideInputColumn,
}) {
	const [internal, setInternal] = useInternalTableStep(step)
	const { output, outputHasChanged, onOutputChanged } = useStepOutputHandling(
		workflow,
		step,
	)
	const handleSaveClick = useHandleSaveClick(internal, onSave)
	const disableSave = useMemo<boolean>(
		() => isEqual(step, internal) && !outputHasChanged,
		[step, internal, outputHasChanged],
	)

	return (
		<Container style={style}>
			{showGuidanceButton && internal?.verb ? (
				<IconButton
					onClick={toggleGuidance}
					iconProps={icons.info}
					checked={showGuidance}
					styles={rightButtonStyles}
				/>
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
})
