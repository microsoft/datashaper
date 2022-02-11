/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BinStrategy } from '@data-wrangling-components/core'
import { Dropdown, IDropdownProps } from '@fluentui/react'
import { memo } from 'react'
import { opDropdownStyles } from '../styles.js'

export type BinStrategyDropdownProps = Partial<IDropdownProps>

/**
 * Dropdown wrapper to list out aggregation operations.
 */
export const BinStrategyDropdown: React.FC<BinStrategyDropdownProps> = memo(
	function BinStrategyDropdown(props) {
		return (
			<Dropdown
				required
				label={'Bin strategy'}
				options={options}
				styles={opDropdownStyles}
				{...props}
			/>
		)
	},
)

const options = Object.values(BinStrategy).map(o => ({
	key: o as string,
	text: o as string,
}))
