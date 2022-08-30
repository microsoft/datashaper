/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/schema'
import { coerce } from '@datashaper/tables'
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown, SpinButton } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { CalendarPicker } from '../../controls/index.js'
import {
	Container,
	dropdownStyles,
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
		const booleanOptions: IDropdownOption[] = [
			{ key: 'true', text: 'true' },
			{ key: 'false', text: 'false' },
		]

		const onSelectDate = useCallback(
			(date: Date): void => {
				const val = coerce(date, dataType)
				isKey
					? onKeyChange(
							new Date(value).toISOString(),
							new Date(val).toISOString(),
					  )
					: onValueChange(
							new Date(keyValue).toISOString(),
							new Date(val).toISOString(),
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
				isKey
					? onKeyChange(value.toString(), val.toString())
					: onValueChange(keyValue, val)
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

		const dropDownOnChange = useCallback(
			(
				_e: React.FormEvent<HTMLDivElement>,
				newValue?: IDropdownOption<any> | undefined,
			) => {
				if (newValue !== undefined) {
					isKey
						? onKeyChange(value, newValue.key)
						: onValueChange(keyValue, newValue.key === 'true' ? true : false)
				}
			},
			[onKeyChange, onValueChange],
		)

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
					<Dropdown
						selectedKey={value.toString()}
						options={booleanOptions}
						styles={dropdownStyles}
						onChange={dropDownOnChange}
					/>
				) : null}
			</Container>
		)
	},
)
