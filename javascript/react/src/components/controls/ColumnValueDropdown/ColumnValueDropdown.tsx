/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { dropdownStyles } from '../../../styles.js'
import type { ColumnValueDropdownProps } from './ColumnValueDropdown.types.js'

/**
 * Dropdown wrapper to automatically list the row cell values for a column.
 */
export const ColumnValueDropdown: React.FC<ColumnValueDropdownProps> = memo(
	function ColumnValueDropdown({ ...props }) {
		return (
			<Dropdown
				label={'Value'}
				placeholder={'Choose value'}
				styles={dropdownStyles}
				{...props}
			/>
		)
	},
)
