/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	RecodeStep,
	Value,
	DataType,
	coerce,
} from '@data-wrangling-components/core'
import {
	ActionButton,
	Icon,
	IconButton,
	IDropdownOption,
	TextField,
} from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { useLoadTable, useColumnType } from '../../common'
import { ColumnValueDropdown } from '../../controls'
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
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as RecodeStep, [step])

	const tbl = useLoadTable(input || step.input, table, store)

	const values = useColumnValues(internal, tbl)
	const dataType = useColumnType(tbl, internal.args.column)

	const handleRecodeChange = useHandleRecodeChange(internal, onChange)
	const handleRecodeDelete = useRecodeDelete(internal, onChange)
	const handleButtonClick = useHandleAddButtonClick(internal, values, onChange)

	const columnPairs = useRecodePairs(
		tbl,
		internal,
		values,
		dataType,
		handleRecodeChange,
		handleRecodeDelete,
	)

	const disabled = useDisabled(internal, values)

	return (
		<Container>
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
	dataType: DataType,
	onChange: (previous: Value, oldvalue: Value, newvalue: Value) => void,
	onDelete: (value: Value) => void,
) {
	return useMemo(() => {
		const { map } = internal.args
		return Object.entries(map || {}).map((valuePair, index) => {
			// the old value will always come off the map as a string key
			// coerce it to the column type for proper comparison
			const [o, newvalue] = valuePair
			const oldvalue = coerce(o, dataType)
			const valueFilter = (value: Value) => {
				if (value === oldvalue) {
					return true
				}
				if (internal.args.map && internal.args.map[value]) {
					return false
				}
				return true
			}
			const handleSourceChange = (
				e: React.FormEvent<HTMLDivElement>,
				opt?: IDropdownOption<any> | undefined,
			) => onChange(oldvalue, opt?.key || oldvalue, newvalue)
			const handleTextChange = (
				e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				newValue?: string,
			) => {
				// this does force the new value to match the old type, preventing mappings like 0 -> false
				const val = coerce(newValue, dataType)
				onChange(oldvalue, oldvalue, val)
			}
			const handleDeleteClick = () => onDelete(oldvalue)
			return (
				<ColumnPair key={`column-Recode-${oldvalue}-${index}`}>
					<ColumnValueDropdown
						column={internal.args.column}
						table={table}
						values={values}
						filter={valueFilter}
						label={undefined}
						selectedKey={oldvalue}
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
						placeholder={'New value'}
						value={newvalue}
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
	}, [table, internal, values, dataType, onChange, onDelete])
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
