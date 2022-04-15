/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxProps } from '@fluentui/react'
import { ComboBox, SelectableOptionMenuItemType } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { dropdownStyles } from '../../styles.js'
import { useDateFormatPatternOptions } from './DateFormatPatternCombobox.hooks.js'

export interface DateFormatPatternComboboxProps
	extends Partial<IComboBoxProps> {
	columnName?: string
}

/**
 * ComboBox that allows the user to either input a freeform value or select a column.
 * We frequently have operations where a comparison may be to a fixed value, or should
 * be dependent on per-row column values.
 */
export const DateFormatPatternCombobox: React.FC<DateFormatPatternComboboxProps> =
	memo(function ColumnValueComboBox({ columnName, ...props }) {
		const options = useDateFormatPatternOptions()
		const withHeader = useMemo(() => {
			return [
				{
					key: 'header',
					text: 'Values',
					itemType: SelectableOptionMenuItemType.Header,
				},
				...options,
			]
		}, [options])

		return (
			<ComboBox
				allowFreeform={true}
				label={'Date format pattern'}
				placeholder={'Select date format'}
				autoComplete="off"
				options={withHeader}
				styles={dropdownStyles}
				dropdownMaxWidth={200}
				useComboBoxAsMenuWidth
				{...props}
			/>
		)
	})
