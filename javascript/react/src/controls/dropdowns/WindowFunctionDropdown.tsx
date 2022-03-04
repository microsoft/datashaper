/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { WindowFunction } from '@data-wrangling-components/core'
import { Dropdown, IDropdownProps } from '@fluentui/react'
import { memo } from 'react'
import { opDropdownStyles } from '../styles.js'

export type WindowFunctionDropdownProps = Partial<IDropdownProps>

/**
 * Dropdown wrapper to list out aggregation operations.
 */
export const WindowFunctionDropdown: React.FC<WindowFunctionDropdownProps> =
	memo(function WindowFunctionDropdown(props) {
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

const options = Object.values(WindowFunction).map(o => ({
	key: o,
	text: o,
}))
