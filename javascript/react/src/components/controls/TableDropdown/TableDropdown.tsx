/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { dropdownStyles } from '../../styles.js'
import type { TableDropdownProps } from './TableDropdown.types.js'

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
