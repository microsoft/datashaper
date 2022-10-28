/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { getDropdownValue } from '../ArqueroDetailsList.utils.js'
import { usePlaceholderValues } from './ArrayDropdownCell.hooks.js'
import { dropdownStyles } from './ArrayDropdownCell.styles.js'
import type { DropdownCellProps } from './types.js'

/**
 * Renders an array-valued cell as a dropdown.
 */
export const ArrayDropdownCell: React.FC<DropdownCellProps> = memo(
	function ArrayDropdownCell({ item, column, onCellDropdownSelect, rowIndex }) {
		const values = getDropdownValue(item, rowIndex, column) || EMPTY_ARRAY
		const placeholderValues = usePlaceholderValues(values)

		return (
			<Dropdown
				onChange={onCellDropdownSelect}
				placeholder={placeholderValues}
				options={values}
				styles={dropdownStyles}
			></Dropdown>
		)
	},
)
