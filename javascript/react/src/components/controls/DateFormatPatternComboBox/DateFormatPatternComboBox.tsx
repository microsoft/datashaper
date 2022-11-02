/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ComboBox } from '@fluentui/react'
import { memo } from 'react'

import { dropdownStyles } from '../../styles.js'
import { useOptions } from './DateFormatPatternComboBox.hooks.js'
import type { DateFormatPatternComboBoxProps } from './DateFormatPatternComboBox.types.js'
/**
 * ComboBox that allows the user to either input a freeform value or select a column.
 * We frequently have operations where a comparison may be to a fixed value, or should
 * be dependent on per-row column values.
 */
export const DateFormatPatternComboBox: React.FC<DateFormatPatternComboBoxProps> =
	memo(function DateFormatPatternComboBox({ columnName, ...props }) {
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
