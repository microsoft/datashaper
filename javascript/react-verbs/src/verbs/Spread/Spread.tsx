/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs, Step } from '@data-wrangling-components/core'
import {
	ColumnSpread,
	TableColumnDropdown,
} from '@data-wrangling-components/react-controls'
import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import {
	useDropdownChangeHandler,
	useSimpleDropdownOptions,
	useTableColumnNames,
} from '@data-wrangling-components/react-hooks'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { ActionButton, Label } from '@fluentui/react'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const Spread: React.FC<StepComponentProps<SpreadArgs>> = memo(
	withLoadedTable(function Spread({ step, onChange, dataTable }) {
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
	}),
)

function next(columns: string[]): string {
	return `New column (${columns.length})`
}

function useColumns(
	step: Step<SpreadArgs>,
	onChange?: (step: Step<SpreadArgs>) => void,
) {
	return useMemo(() => {
		return (step.args.to || []).map((column: string, index: number) => {
			const handleColumnChange = (col: string) => {
				const update = { ...step }
				set(update, `args.to[${index}]`, col)
				onChange?.(update)
			}

			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.to.splice(index, 1)
				onChange?.(update)
			}

			return (
				<ColumnSpread
					key={`column-list-${index}`}
					column={column}
					onChange={handleColumnChange}
					onDelete={handleDeleteClick}
				/>
			)
		})
	}, [step, onChange])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
`

const labelStyles = {
	root: {
		paddingBottom: 0,
	},
}
