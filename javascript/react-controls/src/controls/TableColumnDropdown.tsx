/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption,IDropdownProps } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { dropdownStyles } from '../styles.js'

export interface TableColumnDropdownProps extends Partial<IDropdownProps> {
	options: IDropdownOption[]
}

/**
 * Dropdown wrapper to automatically list the columns of an Arquero table.
 */
export const TableColumnDropdown: React.FC<TableColumnDropdownProps> = memo(
	function TableColumnDropdown({ ...props }) {
		return (
			<Dropdown
				label={'Column'}
				placeholder={'Choose column'}
				styles={dropdownStyles}
				{...props}
			/>
		)
	},
)
