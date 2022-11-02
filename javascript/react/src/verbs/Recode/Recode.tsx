/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeArgs, Value } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { coerce } from '@datashaper/tables'
import type { Step } from '@datashaper/workflow'
import styled from '@essex/styled-components'
import { ActionButton, Icon, IconButton } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { EMPTY_OBJECT } from '../../empty.js'
import { useColumnType, useStepDataTable } from '../../hooks/index.js'
import type { StepComponentProps } from '../../types.js'
import { DataTypeField } from '../shared/DataTypeField.js'
import {
	useColumnValues,
	useDisabled,
	useHandleAddButtonClick,
	useHandleKeyChange,
	useHandleValueChange,
	useRecodeDelete,
} from './Recode.hooks.js'

/**
 * Provides inputs for a RecodeStep.
 */
export const Recode: React.FC<StepComponentProps<RecodeArgs>> = memo(
	function Recode({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
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
					iconProps={addIconProps}
					disabled={disabled}
				>
					Add mapping
				</ActionButton>
			</Container>
		)
	},
)

function useRecodePairs(
	step: Step<RecodeArgs>,
	dataType: DataType,
	onKeyChange: (oldKey: Value, newKey: Value) => void,
	onValueChange: (key: Value, newValue: Value) => void,
	onDelete: (value: Value) => void,
) {
	return useMemo(() => {
		const { mapping } = step.args
		return Object.entries(mapping || EMPTY_OBJECT).map((valuePair, index) => {
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
	}, [step, dataType, onKeyChange, onValueChange, onDelete])
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

	const handleDeleteClick = () =>
		onDelete(dataType === DataType.Date ? keyValue.toISOString() : keyValue)

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
				iconProps={deleteIconProps}
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
	justify-content: flex-start;
	align-items: center;
`

const addIconProps = { iconName: 'Add' }
const deleteIconProps = { iconName: 'Delete' }
