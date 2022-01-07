/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RecodeStep, Value } from '@data-wrangling-components/core'
import {
	ActionButton,
	Icon,
	IconButton,
	IDropdownOption,
	TextField,
} from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
	useHandleDropdownChange,
	useHandleTextfieldChange,
	useLoadTable,
} from '../../common'
import { ColumnValueDropdown, TableColumnDropdown } from '../../controls'
import { columnDropdownStyles } from '../../controls/styles'
import { StepComponentProps } from '../../types'
import {
	useColumnValues,
	useDisabled,
	useHandleAddButtonClick,
	useHandleRecodeChange,
	useRecodeDelete,
} from './hooks'

/**
 * Provides inputs for a RecodeStep.
 */
export const Recode: React.FC<StepComponentProps> = memo(function Recode({
	step,
	store,
	onChange,
}) {
	const internal = useMemo(() => step as RecodeStep, [step])

	const [table, setTable] = useState<ColumnTable | undefined>()
	useLoadTable(internal.input, store, setTable)

	const values = useColumnValues(internal, table)

	const handleAsChange = useHandleTextfieldChange(internal, 'args.as', onChange)
	const handleColumnChange = useHandleDropdownChange(
		internal,
		'args.column',
		onChange,
	)
	const handleRecodeChange = useHandleRecodeChange(internal, onChange)
	const handleRecodeDelete = useRecodeDelete(internal, onChange)
	const handleButtonClick = useHandleAddButtonClick(internal, values, onChange)

	const columnPairs = useRecodePairs(
		table,
		internal,
		values,
		handleRecodeChange,
		handleRecodeDelete,
	)

	const disabled = useDisabled(internal, table)

	return (
		<Container>
			<TextField
				required
				label={'New column name'}
				placeholder={'Column name'}
				value={internal.args.as}
				styles={columnDropdownStyles}
				onChange={handleAsChange}
			/>
			<TableColumnDropdown
				table={table}
				label={'Column to recode'}
				selectedKey={internal.args.column}
				onChange={handleColumnChange}
			/>
			{columnPairs}
			<ActionButton
				onClick={handleButtonClick}
				iconProps={{ iconName: 'Add' }}
				disabled={disabled}
			>
				Add mapping
			</ActionButton>
		</Container>
	)
})

function useRecodePairs(
	table: ColumnTable | undefined,
	internal: RecodeStep,
	values: Value[],
	onChange: (previous: string, oldname: string, newname: string) => void,
	onDelete: (name: string) => void,
) {
	return useMemo(() => {
		const { map } = internal.args
		return Object.entries(map || {}).map((column, index) => {
			const [oldname, newname] = column
			const valueFilter = (name: string) => {
				if (name === oldname) {
					return true
				}
				if (internal.args.map && internal.args.map[name]) {
					return false
				}
				return true
			}
			const handleSourceChange = (
				e: React.FormEvent<HTMLDivElement>,
				opt?: IDropdownOption<any> | undefined,
			) => onChange(oldname, (opt?.key as string) || oldname, newname)
			const handleTextChange = (
				e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				newValue?: string,
			) => {
				onChange(oldname, oldname, newValue ?? '')
			}
			const handleDeleteClick = () => onDelete(oldname)
			return (
				<ColumnPair key={`column-Recode-${oldname}-${index}`}>
					<ColumnValueDropdown
						column={internal.args.column}
						table={table}
						values={values}
						filter={valueFilter}
						label={undefined}
						selectedKey={oldname}
						onChange={handleSourceChange}
						styles={{
							root: {
								width: 120,
							},
						}}
					/>
					<Icon
						iconName={'Forward'}
						styles={{ root: { marginLeft: 4, marginRight: 4 } }}
					/>
					<TextField
						placeholder={'New name'}
						value={newname}
						onChange={handleTextChange}
						styles={{ root: { width: 120 } }}
					/>
					<IconButton
						title={'Remove this Recode'}
						iconProps={{ iconName: 'Delete' }}
						onClick={handleDeleteClick}
					/>
				</ColumnPair>
			)
		})
	}, [table, internal, values, onChange, onDelete])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`

const ColumnPair = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`
