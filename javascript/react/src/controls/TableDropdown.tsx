/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '@data-wrangling-components/core'
import type { IDropdownProps } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'
import { useTableOptions } from '../common/index.js'
import { dropdownStyles } from './styles.js'

export interface TableDropdownProps extends Partial<IDropdownProps> {
	store?: TableStore
}

/**
 * Dropdown wrapper to automatically list the tables in a TableStore.
 */
export const TableDropdown: React.FC<TableDropdownProps> = memo(
	function TableDropdown(props) {
		const { store, ...rest } = props
		const tableOptions = useTableOptions(store)
		return (
			<Dropdown
				label={'Table'}
				placeholder={'Choose table'}
				options={tableOptions}
				styles={dropdownStyles}
				{...rest}
			/>
		)
	},
)
