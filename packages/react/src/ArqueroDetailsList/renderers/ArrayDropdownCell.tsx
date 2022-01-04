/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Dropdown, IDropdownOption } from '@fluentui/react'
import { isEqual, uniqWith } from 'lodash'
import { memo } from 'react'
import { getDropdownValue, getValue } from '../util'
import { DropdownCellProps } from './types'

/**
 * Renders an array-valued cell as a dropdown.
 */
export const ArrayDropdownCell: React.FC<DropdownCellProps> = memo(
	function ArrayDropdownCell({ item, column, onCellDropdownSelect, rowIndex }) {
		const values = getDropdownValue(item, rowIndex, column) || []
		const uniqueValues = uniqWith(values, isEqual) as IDropdownOption<any>[]
		const placeholderValues = getValue(item, column) || 'Open to see the values'

		return (
			<Dropdown
				onChange={onCellDropdownSelect}
				placeholder={placeholderValues}
				options={uniqueValues}
			></Dropdown>
		)
	},
)
