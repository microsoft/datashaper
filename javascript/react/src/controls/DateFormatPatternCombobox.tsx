/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ComboBox } from '@fluentui/react'
import { memo } from 'react'

import { dropdownStyles } from '../styles.js'
import { useOptions } from './DateFormatPatternCombobox.hooks.js'
import type { DateFormatPatternComboboxProps } from './DateFormatPatternCombobox.types.js'
/**
 * ComboBox that allows the user to either input a freeform value or select a column.
 * We frequently have operations where a comparison may be to a fixed value, or should
 * be dependent on per-row column values.
 */
export const DateFormatPatternCombobox: React.FC<DateFormatPatternComboboxProps> =
	memo(function DateFormatPatternCombobox({ columnName, ...props }) {
		const options = useOptions()

		return (
			<ComboBox
				allowFreeform={true}
				label={'Date format pattern'}
				placeholder={'Select date format'}
				autoComplete="off"
				options={options}
				styles={dropdownStyles}
				dropdownMaxWidth={200}
				useComboBoxAsMenuWidth
				{...props}
			/>
		)
	})
