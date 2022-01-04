/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Dropdown } from '@fluentui/react'
import { memo } from 'react'
import { getDropdownValue, getValue } from '../util'
import { DropdownCellProps } from './types'

/**
 * Renders an array-valued cell as a dropdown.
 */
export const ArrayDropdownCell: React.FC<DropdownCellProps> = memo(
	function ArrayDropdownCell({ item, column, onCellDropdownSelect, rowIndex }) {
		const values = getDropdownValue(item, rowIndex, column) || []
		const placeholderValues = getValue(item, column) || 'Open to see the values'

		return (
			<Dropdown
				onChange={onCellDropdownSelect}
				placeholder={placeholderValues}
				options={values}
			></Dropdown>
		)
	},
)
