/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxProps } from '@fluentui/react'
import { ComboBox, SelectableOptionMenuItemType } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useMemo } from 'react'

import { useColumnValueOptions } from '../common/index.js'
import { dropdownStyles } from './styles.js'

export interface ColumnValueComboBoxProps extends Partial<IComboBoxProps> {
	table?: ColumnTable
	columnName?: string
}

/**
 * ComboBox that allows the user to either input a freeform value or select a column.
 * We frequently have operations where a comparison may be to a fixed value, or should
 * be dependent on per-row column values.
 */
export const ColumnValueComboBox: React.FC<ColumnValueComboBoxProps> = memo(
	function ColumnValueComboBox({ table, columnName, ...rest }) {
		const options = useColumnValueOptions(columnName ?? '', table, true)
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
				label={'Value'}
				placeholder={'Select value'}
				autoComplete="on"
				options={withHeader}
				styles={dropdownStyles}
				dropdownMaxWidth={200}
				useComboBoxAsMenuWidth
				{...rest}
			/>
		)
	},
)
