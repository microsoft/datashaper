/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '@essex/arquero'
import type { IDropdownProps, IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { dropdownStyles } from '../styles.js'

export interface ColumnValueDropdownProps extends Partial<IDropdownProps> {
	column: string
	values?: Value[]
	options: IDropdownOption[]
	/**
	 * Optional filter function to apply to the values list.
	 */
	filter?: (value: Value) => boolean
}

/**
 * Dropdown wrapper to automatically list the row cell values for a column.
 */
export const ColumnValueDropdown: React.FC<ColumnValueDropdownProps> = memo(
	function ColumnValueDropdown({ column, options, values, filter, ...props }) {
		return (
			<Dropdown
				label={'Value'}
				placeholder={'Choose value'}
				options={options}
				styles={dropdownStyles}
				{...props}
			/>
		)
	},
)
