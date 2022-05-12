/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@data-wrangling-components/core'
import { ActionButton, Label } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { TableColumnDropdown } from '../controls/index.js'
import {
	useDropdownChangeHandler,
	useSimpleDropdownOptions,
	useTableColumnNames,
	useStepDataTable,
} from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { useColumns } from './Spread.hooks.js'
import { Container, labelStyles } from './Spread.styles.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const Spread: React.FC<StepComponentProps<SpreadArgs>> = memo(
	function Spread({ step, graph, input, table, onChange }) {
		const dataTable = useStepDataTable(step, graph, input, table)
		const columns = useColumns(step, onChange)

		const handleButtonClick = useCallback(() => {
			onChange?.({
				...step,
				args: {
					...step.args,
					to: [...step.args.to, next(step.args.to)],
				},
			})
		}, [step, onChange])

		const handleColumnChange = useDropdownChangeHandler(
			step,
			(s, val) => (s.args.column = val as string),
			onChange,
		)

		const colNames = useTableColumnNames(dataTable)
		const options = useSimpleDropdownOptions(colNames)

		return (
			<Container>
				<TableColumnDropdown
					required
					options={options}
					label={'Column to spread'}
					selectedKey={(step.args as SpreadArgs).column}
					onChange={handleColumnChange}
				/>

				<Label styles={labelStyles}>New column names</Label>

				{columns}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={!dataTable}
				>
					Add column
				</ActionButton>
			</Container>
		)
	},
)

function next(columns: string[]): string {
	return `New column (${columns.length})`
}
