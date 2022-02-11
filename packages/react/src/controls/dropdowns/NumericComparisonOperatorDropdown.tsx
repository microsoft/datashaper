/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NumericComparisonOperator } from '@data-wrangling-components/core'
import { Dropdown, IDropdownProps } from '@fluentui/react'
import { memo } from 'react'
import { opDropdownStyles } from '../styles.js'

export type NumericComparisonOperatorDropdownProps = Partial<IDropdownProps>

/**
 * Dropdown wrapper to list out numeric comparison operations.
 */
export const NumericComparisonOperatorDropdown: React.FC<NumericComparisonOperatorDropdownProps> =
	memo(function NumericComparisonOperatorDropdown(props) {
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

const options = Object.values(NumericComparisonOperator).map(o => ({
	key: o as string,
	text: o as string,
}))
