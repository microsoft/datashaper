/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeArgs, Step } from '@data-wrangling-components/core'
import { ColumnValueDropdown } from '@data-wrangling-components/react-controls'
import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import {
	useColumnType,
	useColumnValueOptions,
} from '@data-wrangling-components/react-hooks'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import type { DataType, Value } from '@essex/arquero'
import { coerce } from '@essex/arquero'
import type { IDropdownOption } from '@fluentui/react'
import { ActionButton, Icon, IconButton, TextField } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import {
	useColumnValues,
	useDisabled,
	useHandleAddButtonClick,
	useHandleRecodeChange,
	useRecodeDelete,
} from './hooks.js'

/**
 * Provides inputs for a RecodeStep.
 */
export const Recode: React.FC<StepComponentProps<RecodeArgs>> = memo(
	withLoadedTable(function Recode({ step, onChange, dataTable }) {
		const values = useColumnValues(step, dataTable)
		const dataType = useColumnType(dataTable, step.args.column)
		const handleRecodeChange = useHandleRecodeChange(step, onChange)
		const handleRecodeDelete = useRecodeDelete(step, onChange)
		const handleButtonClick = useHandleAddButtonClick(step, values, onChange)

		const columnPairs = useRecodePairs(
			dataTable,
			step,
			dataType,
			handleRecodeChange,
			handleRecodeDelete,
		)

		const disabled = useDisabled(step, values)

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
	}),
)

function useRecodePairs(
	table: ColumnTable | undefined,
	step: Step<RecodeArgs>,
	dataType: DataType,
	onChange: (previous: Value, oldvalue: Value, newvalue: Value) => void,
	onDelete: (value: Value) => void,
) {
	return useMemo(() => {
		const { map } = step.args
		return Object.entries(map || {}).map((valuePair, index) => {
			const [o] = valuePair
			const oldvalue = coerce(o, dataType)
			return (
				<ColumnPair
					step={step}
					table={table}
					valuePair={valuePair}
					dataType={dataType}
					key={`column-Recode-${oldvalue}-${index}`}
					onChange={onChange}
					onDelete={onDelete}
				/>
			)
		})
	}, [table, step, dataType, onChange, onDelete])
}

const ColumnPair: React.FC<{
	valuePair: [string, any]
	step: Step<RecodeArgs>
	table: ColumnTable | undefined
	dataType: DataType
	onChange: (previous: Value, oldvalue: Value, newvalue: Value) => void
	onDelete: (value: Value) => void
}> = memo(function ColumnPair({
	valuePair,
	step,
	table,
	dataType,
	onChange,
	onDelete,
}) {
	// the old value will always come off the map as a string key
	// coerce it to the column type for proper comparison
	const [o, newvalue] = valuePair
	const oldvalue = coerce(o, dataType)
	const valueFilter = (value: Value) => {
		if (value === oldvalue) {
			return true
		}
		if (step.args.map && step.args.map[value]) {
			return false
		}
		return true
	}
	const handleSourceChange = (
		_e: React.FormEvent<HTMLDivElement>,
		opt?: IDropdownOption<any> | undefined,
	) => onChange(oldvalue, opt?.key || oldvalue, newvalue)
	const handleTextChange = (
		_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
		newValue?: string,
	) => {
		// this does force the new value to match the old type, preventing mappings like 0 -> false
		const val = coerce(newValue, dataType)
		onChange(oldvalue, oldvalue, val)
	}
	const handleDeleteClick = () => onDelete(oldvalue)
	const options = useColumnValueOptions(
		step.args.column,
		table,
		undefined,
		valueFilter,
	)
	return (
		<ColumnPairContainer>
			<ColumnValueDropdown
				options={options}
				label={undefined}
				selectedKey={oldvalue}
				onChange={handleSourceChange}
				styles={{
					root: {
						width: 130,
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
				styles={{ root: { width: 130 } }}
			/>
			<IconButton
				title={'Remove this Recode'}
				iconProps={{ iconName: 'Delete' }}
				onClick={handleDeleteClick}
			/>
		</ColumnPairContainer>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
`

const ColumnPairContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`
