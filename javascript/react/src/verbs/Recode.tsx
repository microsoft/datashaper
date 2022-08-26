/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { coerce } from '@datashaper/arquero'
import type { Step } from '@datashaper/core'
import type { RecodeArgs, Value } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
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
		const dataType = useColumnType(dataTable, step.args.column)
		const initialValues = useColumnValues(step, dataTable)
		const values =
			dataType === DataType.Date
				? initialValues.map(e => e.toISOString())
				: initialValues
		const handleRecodeKeyChange = useHandleKeyChange(step, onChange)
		const handleRecodeValueChange = useHandleValueChange(
			step,
			dataType,
			onChange,
		)
		const handleRecodeDelete = useRecodeDelete(step, onChange)
		const handleButtonClick = useHandleAddButtonClick(step, values, onChange)

		const columnPairs = useRecodePairs(
			dataTable,
			step,
			dataType,
			handleRecodeKeyChange,
			handleRecodeValueChange,
			handleRecodeDelete,
		)

		const disabled = useDisabled(step, values)

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
			return (
				<ColumnPair
					valuePair={valuePair}
					dataType={dataType}
					key={`column-Recode-${index}`}
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
	dataType: DataType
	onKeyChange: (oldKey: Value, newKey: Value) => void
	onValueChange: (key: Value, newValue: Value) => void
	onDelete: (value: Value) => void
}> = memo(function ColumnPair({
	valuePair,
	dataType,
	onKeyChange,
	onValueChange,
	onDelete,
}) {
	// the old value will always come off the map as a string key
	// coerce it to the column type for proper comparison
	const [o, q] = valuePair
	let keyValue = coerce(o, dataType)
	const propertyValue = coerce(q, dataType)

	if (dataType === DataType.Boolean) {
		o === 'false' ? (keyValue = false) : (keyValue = true)
	}

	const handleDeleteClick = () => onDelete(keyValue)

	return (
		<ColumnPairContainer>
			<DataTypeField
				placeholder={'Current value'}
				dataType={dataType}
				value={keyValue}
				onKeyChange={onKeyChange}
				onValueChange={onKeyChange}
				isKey={true}
				keyValue={keyValue}
			/>

			<Icon
				iconName={'Forward'}
				styles={{ root: { marginLeft: 4, marginRight: 4 } }}
			/>

			<DataTypeField
				placeholder={'New Value'}
				dataType={dataType}
				keyValue={keyValue}
				value={propertyValue}
				onKeyChange={onValueChange}
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
