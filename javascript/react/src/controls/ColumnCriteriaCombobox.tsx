/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ComboBox, SelectableOptionMenuItemType } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { narrowDropdownStyles } from '../styles.js'
import type { ColumnCriteriaComboboxProps } from './ColumnCriteriaCombobox.types.js'

/**
 * ComboBox that allows the user to either input a freeform value or select a column.
 * We frequently have operations where a comparison may be to a fixed value, or should
 * be dependent on per-row column values.
 */
export const ColumnCriteriaCombobox: React.FC<ColumnCriteriaComboboxProps> =
	memo(function ColumnCriteriaCombobox({ options, ...props }) {
		const withHeader = useMemo(() => {
			return [
				{
					key: 'header',
					text: 'Columns',
					itemType: SelectableOptionMenuItemType.Header,
				},
				...options,
			]
		}, [options])
		return (
			<ComboBox
				allowFreeform={false}
				autoComplete={'on'}
				placeholder={'Column'}
				options={withHeader}
				styles={narrowDropdownStyles}
				{...props}
			/>
		)
	})
