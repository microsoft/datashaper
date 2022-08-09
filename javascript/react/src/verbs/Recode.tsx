/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeArgs, Step } from '@data-wrangling-components/core'
import type { DataType, Value } from '@essex/arquero'
import { coerce } from '@essex/arquero'
import styled from '@essex/styled-components'
import { ActionButton, Icon, IconButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useMemo } from 'react'

import { useColumnType, useStepDataTable } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import {
	useColumnValues,
	useDisabled,
	useHandleAddButtonClick,
	useHandleKeyChange,
	useHandleValueChange,
	useRecodeDelete,
} from './Recode.hooks.js'
import { DataTypeField } from './shared/DataTypeField.js'

/**
 * Provides inputs for a RecodeStep.
 */
export const Recode: React.FC<StepComponentProps<RecodeArgs>> = memo(
	function Recode({ step, graph, input, table, onChange }) {
		const dataTable = useStepDataTable(step, graph, input, table)
		const values = useColumnValues(step, dataTable)
		const dataType = useColumnType(dataTable, step.args.column)
		const handleRecodeKeyChange = useHandleKeyChange(step, onChange)
		const handleRecodeValueChange = useHandleValueChange(step, onChange)
		const handleRecodeDelete = useRecodeDelete(step, onChange)
		const handleButtonClick = useHandleAddButtonClick(
			step,
			values,
			dataType,
			onChange,
		)

		const columnPairs = useRecodePairs(
			dataTable,
			step,
			dataType,
			handleRecodeKeyChange,
			handleRecodeValueChange,
			handleRecodeDelete,
		)

		const disabled = useDisabled(step, values)

		console.log(step)

		return (
			<Container>
				<ColumnPairs>{columnPairs}</ColumnPairs>
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={disabled}
				>
					Add mapping
				</ActionButton>
			</Container>
		)
	},
)

function useRecodePairs(
	table: ColumnTable | undefined,
	step: Step<RecodeArgs>,
	dataType: DataType,
	onKeyChange: (oldKey: Value, newKey: Value) => void,
	onValueChange: (key: Value, newValue: Value) => void,
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
					onKeyChange={onKeyChange}
					onValueChange={onValueChange}
					onDelete={onDelete}
				/>
			)
		})
	}, [table, step, dataType, onKeyChange, onValueChange, onDelete])
}

const ColumnPair: React.FC<{
	valuePair: [string, any]
	step: Step<RecodeArgs>
	table: ColumnTable | undefined
	dataType: DataType
	onKeyChange: (oldKey: Value, newKey: Value) => void
	onValueChange: (key: Value, newValue: Value) => void
	onDelete: (value: Value) => void
}> = memo(function ColumnPair({
	valuePair,
	step,
	table,
	dataType,
	onKeyChange,
	onValueChange,
	onDelete,
}) {
	// the old value will always come off the map as a string key
	// coerce it to the column type for proper comparison
	const [o, newvalue] = valuePair
	const oldvalue = coerce(o, dataType)

	const handleDeleteClick = () => onDelete(oldvalue)

	console.log(valuePair)

	return (
		<ColumnPairContainer>
			<DataTypeField
				placeholder={'Current value'}
				dataType={dataType}
				value={oldvalue}
				onKeyChange={onKeyChange}
				isKey={true}
				keyValue={oldvalue}
			/>

			<Icon
				iconName={'Forward'}
				styles={{ root: { marginLeft: 4, marginRight: 4 } }}
			/>

			<DataTypeField
				placeholder={'New Value'}
				dataType={dataType}
				keyValue={oldvalue}
				value={newvalue}
				onValueChange={onValueChange}
				isKey={false}
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
`
const ColumnPairs = styled.div`
	margin-top: 8px;
	display: flex;
	flex-direction: column;
	gap: 5px;
`

const ColumnPairContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`
