/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataType, type Value } from '@datashaper/schema'
import { coerce } from '@datashaper/tables'
import styled from '@essex/styled-components'
import type {
	IStyleFunctionOrObject,
	ITextFieldStyleProps,
	ITextFieldStyles
} from '@fluentui/react'
import { Icon, IconButton, TextField } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { DataTypeField } from '../../components/verbs/forms/shared/DataTypeField.js'
import { EMPTY_OBJECT } from '../../empty.js'

export function useMappingPairs(
	mapping: Record<Value, Value>,
	dataType: DataType,
	onKeyChange: (oldKey: Value, newKey: Value) => void,
	onValueChange: (key: Value, newValue: Value) => void,
	onDelete: (key: Value) => void,
	dropdownStyles?: IStyleFunctionOrObject<
		ITextFieldStyleProps,
		ITextFieldStyles
	>,
	disabled?: boolean,
): JSX.Element[] {
	return useMemo(() => {
		return Object.entries(mapping || EMPTY_OBJECT).map((valuePair, index) => {
			return (
				<ColumnPair
					valuePair={valuePair}
					dataType={dataType}
					key={`column-Mapping-${index}`}
					onKeyChange={onKeyChange}
					onValueChange={onValueChange}
					onDelete={onDelete}
					dropdownStyles={dropdownStyles}
					disabled={disabled}
				/>
			)
		})
	}, [
		mapping,
		dataType,
		dropdownStyles,
		disabled,
		onKeyChange,
		onValueChange,
		onDelete,
	])
}

const ColumnPair: React.FC<{
	valuePair: [string, any]
	dataType: DataType
	onKeyChange: (oldKey: Value, newKey: Value) => void
	onValueChange: (key: Value, newValue: Value) => void
	onDelete: (key: Value) => void
	dropdownStyles?: IStyleFunctionOrObject<
		ITextFieldStyleProps,
		ITextFieldStyles
	>
	disabled?: boolean
}> = memo(function ColumnPair({
	valuePair,
	dataType,
	onKeyChange,
	onValueChange,
	onDelete,
	dropdownStyles,
	disabled,
}) {
	// the old value will always come off the map as a string key
	// coerce the key to the column type for proper comparison
	// the newValue will always be a string since it can be of any type
	const [o, newValue] = valuePair
	let keyValue = o !== ' ' ? coerce(o, dataType) : o

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
				dropdownStyles={dropdownStyles}
				disabled={disabled}
			/>

			<Icon
				iconName={'Forward'}
				styles={{ root: { marginLeft: 4, marginRight: 4 } }}
			/>

			<TextField
				placeholder={'New Value'}
				value={newValue}
				onChange={(_: Value, val?: string) => onValueChange(keyValue, val)}
				disabled={disabled}
			/>

			<IconButton
				title={'Remove this mapping'}
				iconProps={deleteIconProps}
				onClick={handleDeleteClick}
				disabled={disabled}
			/>
		</ColumnPairContainer>
	)
})

const deleteIconProps = { iconName: 'Delete' }

const ColumnPairContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
`
