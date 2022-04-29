/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption,IDropdownProps } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { dropdownStyles } from '../styles.js'

export interface TableDropdownProps extends Partial<IDropdownProps> {
	options: IDropdownOption[]
}

/**
 * Dropdown wrapper to automatically list the tables in a TableStore.
 */
export const TableDropdown: React.FC<TableDropdownProps> = memo(
	function TableDropdown({ options, ...props }) {
		return (
			<Dropdown
				label={'Table'}
				placeholder={'Choose table'}
				options={options}
				styles={dropdownStyles}
				{...props}
			/>
		)
	},
)
