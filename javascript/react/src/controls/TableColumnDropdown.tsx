/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { dropdownStyles } from '../styles.js'
import type { TableColumnDropdownProps } from './TableColumnDropdown.types.js'

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
