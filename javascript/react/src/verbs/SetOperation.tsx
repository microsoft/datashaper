/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { withLoadedTable } from '../hocs/index.js'
import type { StepComponentProps } from '../types.js'
import { ActionButton, Label } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { Container, icons } from './SetOperation.styles.js'
import { useOthers } from './SetOperation.hooks.js'

/**
 * Provides inputs to create a list of tables.
 * E.g., for set operations
 */
export const SetOperation: React.FC<StepComponentProps> = memo(
	withLoadedTable(function SetOperation({ step, graph, onChange, dataTable }) {
		const others = useOthers(step, onChange, graph)

		const handleButtonClick = useCallback(() => {
			onChange?.({
				...step,
				input: {
					...step.input,
					others: [...(step.input.others || []), { node: '' }] as any,
				},
			})
		}, [step, onChange])

		return (
			<Container>
				<Label>With tables</Label>
				{others}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={icons.add}
					disabled={!dataTable}
				>
					Add table
				</ActionButton>
			</Container>
		)
	}),
)
