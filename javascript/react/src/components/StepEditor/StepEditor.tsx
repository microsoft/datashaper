/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import type { IButtonProps } from '@fluentui/react';
import { ActionButton } from '@fluentui/react'
import { isEqual } from 'lodash-es'
import { memo, useMemo, useState } from 'react'

import { EMPTY_OBJECT } from '../../empty.js'
import { StepForm } from '../StepForm/StepForm.js'
import {
	useHandleSaveClick,
	useStepOutputHandling,
} from './StepEditor.hooks.js'
import {
	ButtonContainer,
	Container,
	Flex,
	icons,
	SaveButtonWrapper,
} from './StepEditor.styles.js'
import type { StepEditorProps } from './StepEditor.types.js'

export const StepEditor: React.FC<StepEditorProps> = memo(function StepEditor({
	workflow,
	onSave,
	metadata,
	index,
	step,
	style = EMPTY_OBJECT,
	onDelete,
	hideInputColumn,
}) {
	const [internal, setInternal] = useState<Step | undefined>(step)
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
								<MaybeButton
									onClick={handleSaveClick}
									disabled={disableSave}
									iconProps={icons.checkMark}
								>
									Save
								</MaybeButton>
							</SaveButtonWrapper>
						</Flex>
						<MaybeButton onClick={onDelete} iconProps={icons.delete}>
							Delete
						</MaybeButton>
					</ButtonContainer>
				</>
			)}
		</Container>
	)
})

const MaybeButton: React.FC<IButtonProps> = memo(function MaybeButton({
	onClick,
	...props
}) {
	return onClick ? <ActionButton {...props} onClick={onClick} /> : null
})
