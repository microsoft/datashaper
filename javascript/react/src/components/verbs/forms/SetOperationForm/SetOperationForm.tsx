/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, Label } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { EMPTY_ARRAY } from '../../../../empty.js'
import { useStepDataTable } from '../../../../hooks/steps/useStepDataTable.js'
import type { StepFormProps } from '../types.js'
import { useOthers } from './SetOperationForm.hooks.js'
import { Container, icons, Tables } from './SetOperationForm.styles.js'

/**
 * Provides inputs to create a list of tables.
 * E.g., for set operations
 */
export const SetOperationForm: React.FC<StepFormProps> = memo(
	function SetOperationForm({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const others = useOthers(step, onChange, workflow)

		const handleButtonClick = useCallback(() => {
			onChange?.({
				...step,
				input: {
					...step.input,
					others: [...(step.input.others || EMPTY_ARRAY), { node: '' }] as any,
				},
			})
		}, [step, onChange])

		return (
			<Container>
				<Label>With tables</Label>
				<Tables>{others}</Tables>
				<ActionButton
					onClick={handleButtonClick}
					iconProps={icons.add}
					disabled={!dataTable}
				>
					Add table
				</ActionButton>
			</Container>
		)
	},
)
