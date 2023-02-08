/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { isEqual } from 'lodash-es'
import { memo, useMemo, useState } from 'react'

import { EMPTY_OBJECT } from '../../empty.js'
import { Action } from '../controls/index.js'
import { StepForm } from '../StepForm/StepForm.js'
import {
	useHandleSaveClick,
	useStepOutputHandling,
} from './StepEditor.hooks.js'
import { Actions, Container, icons } from './StepEditor.styles.js'
import type { StepEditorProps } from './StepEditor.types.js'

export const StepEditor: React.FC<StepEditorProps> = memo(function StepEditor({
	workflow,
	onSave: execSave,
	metadata,
	index,
	step,
	style = EMPTY_OBJECT,
	onDelete,
	hideInputColumn,
}) {
	const [internal, setInternal] = useState<Step | undefined>(step)
	const { output, onOutputChanged } = useStepOutputHandling(workflow, step)
	const onSave = useHandleSaveClick(internal, execSave)
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
						hideInputColumn={hideInputColumn}
						onChange={setInternal}
						onChangeOutput={onOutputChanged}
					/>
					<Actions>
						<Action onClick={onSave} iconProps={icons.save}>
							Save
						</Action>
						<Action onClick={onDelete} iconProps={icons.delete}>
							Delete
						</Action>
					</Actions>
				</>
			)}
		</Container>
	)
})
