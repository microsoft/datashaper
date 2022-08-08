/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@essex/arquero'
import { coerce } from '@essex/arquero'
import { SpinButton } from '@fluentui/react'
import { memo, useCallback, useState } from 'react'

import { CalendarPicker } from '../../controls/index.js'
import {
	BooleanToggle,
	Container,
	spinStyles,
	TextValue,
} from './DataTypeField.styles.js'
import type { DataTypeFieldProps } from './DataTypeField.types.js'

/**
 * Just the comparison logic/ops for a filter.
 * Input table and source column is expected to be edited elsewhere and configured as the step input.
 * This is split out from FilterInputs to allow just the comparison logic to be reused elsewhere.
 */
export const DataTypeField: React.FC<DataTypeFieldProps> = memo(
	function DataTypeField({ dataType, oldValue, onChange }) {
		const onSelectDate = useCallback(
			(date: Date): void => {
				const val = coerce(date, dataType)
				onChange(oldValue, oldValue, val)
				setCleanLabel(false)
			},
			[onChange],
		)

		const onChangeTextFieldValue = useCallback(
			(
				_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				newValue?: string,
			) => {
				const val = coerce(newValue, dataType)
				onChange(oldValue, oldValue, val)
				setCleanLabel(false)
			},
			[onChange],
		)

		const spinButtonOnChange = useCallback(
			(_event: React.SyntheticEvent<HTMLElement>, newValue?: string) => {
				if (newValue !== undefined) {
					const val = coerce(newValue, dataType)
					onChange(oldValue, oldValue, val)
				}
			},
			[onChange],
		)

		const onToggleChange = (
			_ev: React.MouseEvent<HTMLElement>,
			checked?: boolean,
		) => {
			const val = coerce(checked, dataType)
			onChange(oldValue, oldValue, val)
		}

		const [cleanLabel, setCleanLabel] = useState<boolean>(false)

		return (
			<Container>
				{dataType === DataType.Date ? (
					<CalendarPicker onSelectDate={onSelectDate} cleanLabel={cleanLabel} />
				) : null}

				{dataType === DataType.String ? (
					<TextValue
						onChange={onChangeTextFieldValue}
						placeholder={'New value'}
					></TextValue>
				) : null}

				{dataType === DataType.Number ? (
					<SpinButton
						min={0}
						step={1}
						styles={spinStyles}
						onChange={spinButtonOnChange}
					/>
				) : null}

				{dataType === DataType.Boolean ? (
					<BooleanToggle
						defaultChecked
						onText="True"
						offText="False"
						onChange={onToggleChange}
					/>
				) : null}
			</Container>
		)
	},
)
