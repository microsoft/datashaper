/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StringComparisonOperator } from '@data-wrangling-components/core'
import type { IDropdownProps } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'
import { opDropdownStyles } from '../styles.js'

export type StringComparisonOperatorDropdownProps = Partial<IDropdownProps>

/**
 * Dropdown wrapper to list out string comparison operations.
 */
export const StringComparisonOperatorDropdown: React.FC<StringComparisonOperatorDropdownProps> =
	memo(function StringComparisonOperatorDropdown(props) {
		return (
			<Dropdown
				required
				label={'Function'}
				options={options}
				styles={opDropdownStyles}
				{...props}
			/>
		)
	})

const options = Object.values(StringComparisonOperator).map(o => ({
	key: o,
	text: o,
}))
