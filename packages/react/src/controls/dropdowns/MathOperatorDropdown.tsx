/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MathOperator } from '@data-wrangling-components/core'
import { Dropdown, IDropdownProps } from '@fluentui/react'
import { memo } from 'react'
import { opDropdownStyles } from '../styles'

export type MathOperatorDropdownProps = Partial<IDropdownProps>

/**
 * Dropdown wrapper to list out math operations.
 */
export const MathOperatorDropdown: React.FC<MathOperatorDropdownProps> = memo(
	function MathOperatorDropdown(props) {
		return (
			<Dropdown
				required
				label={'Function'}
				options={options}
				styles={opDropdownStyles}
				{...props}
			/>
		)
	},
)

const options = Object.values(MathOperator).map(o => ({
	key: o,
	text: o,
}))
