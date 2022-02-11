/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown, IDropdownProps } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

import { memo } from 'react'
import { useTableColumnOptions } from '../../common/index.js'
import { columnDropdownStyles } from '../styles.js'

export interface TableColumnDropdownProps extends Partial<IDropdownProps> {
	table?: ColumnTable
	/**
	 * Optional filter function to apply to the column list.
	 * Passed directly to table.columnNames()
	 */
	filter?: (name: string) => boolean
}

/**
 * Dropdown wrapper to automatically list the columns of an Arquero table.
 */
export const TableColumnDropdown: React.FC<TableColumnDropdownProps> = memo(
	function TableColumnDropdown({ table, filter, ...rest }) {
		const options = useTableColumnOptions(table, filter)
		return (
			<Dropdown
				label={'Column'}
				placeholder={'Select column'}
				options={options}
				styles={columnDropdownStyles}
				{...rest}
			/>
		)
	},
)
