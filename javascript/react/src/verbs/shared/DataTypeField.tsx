/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@essex/arquero'
import { coerce } from '@essex/arquero'
import { SpinButton } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { CalendarPicker } from '../../controls/index.js'
import {
	BooleanToggle,
	Container,
	spinStyles,
	TextValue,
} from './DataTypeField.styles.js'
import type { DataTypeFieldProps } from './DataTypeField.types.js'

export const DataTypeField: React.FC<DataTypeFieldProps> = memo(
	function DataTypeField({
		dataType,
		keyValue,
		value,
		placeholder,
		onKeyChange,
		onValueChange,
		isKey,
	}) {
		const onSelectDate = useCallback(
			(date: Date): void => {
				const val = coerce(date, dataType)
				isKey
					? onKeyChange(
							value.toISOString().split('T')[0],
							val.toISOString().split('T')[0],
					  )
					: onValueChange(
							keyValue.toISOString().split('T')[0],
							val.toISOString().split('T')[0],
					  )
			},
			[onKeyChange, onValueChange],
		)

		const onChangeTextFieldValue = useCallback(
			(
				_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				newValue?: string,
			) => {
				const val = coerce(newValue, dataType)
				isKey ? onKeyChange(value, val) : onValueChange(keyValue, val)
			},
			[onKeyChange, onValueChange],
		)

		const spinButtonOnChange = useCallback(
			(_event: React.SyntheticEvent<HTMLElement>, newValue?: string) => {
				if (newValue !== undefined) {
					const val = coerce(newValue, dataType)
					isKey ? onKeyChange(value, val) : onValueChange(keyValue, val)
				}
			},
			[onKeyChange, onValueChange],
		)

		const onToggleChange = useCallback(
			(_ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
				const val = coerce(checked, dataType)
				isKey ? onKeyChange(value, val) : onValueChange(keyValue, val)
			},
			[onKeyChange, onValueChange],
		)

		console.log(value)

		return (
			<Container>
				{dataType === DataType.Date ? (
					<CalendarPicker onSelectDate={onSelectDate} value={value} />
				) : null}

				{dataType === DataType.String ? (
					<TextValue
						onChange={onChangeTextFieldValue}
						placeholder={placeholder}
						value={value}
					></TextValue>
				) : null}

				{dataType === DataType.Number ? (
					<SpinButton
						min={0}
						step={1}
						value={value}
						styles={spinStyles}
						onChange={spinButtonOnChange}
					/>
				) : null}

				{dataType === DataType.Boolean ? (
					<BooleanToggle
						onText="True"
						offText="False"
						checked={value === true ? true : false}
						onChange={onToggleChange}
					/>
				) : null}
			</Container>
		)
	},
)
