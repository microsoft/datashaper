/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxProps } from '@fluentui/react'
import { ComboBox, SelectableOptionMenuItemType } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useMemo } from 'react'

import { useTableColumnOptions } from '../common/index.js'
import { dropdownStyles } from './styles.js'

export interface ColumnOrValueComboBoxProps extends Partial<IComboBoxProps> {
	table?: ColumnTable
}

/**
 * ComboBox that allows the user to either input a freeform value or select a column.
 * We frequently have operations where a comparison may be to a fixed value, or should
 * be dependent on per-row column values.
 */
export const ColumnOrValueComboBox: React.FC<ColumnOrValueComboBoxProps> = memo(
	function ColumnOrValueComboBox({ table, ...rest }) {
		const options = useTableColumnOptions(table)
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
				allowFreeform
				label={'Column or value'}
				placeholder={'text/number or select column'}
				options={withHeader}
				styles={dropdownStyles}
				{...rest}
			/>
		)
	},
)
