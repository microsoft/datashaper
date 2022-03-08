/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { JoinStrategy } from '@data-wrangling-components/core'
import type { IDropdownProps } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'
import { opDropdownStyles } from '../styles.js'

export type JoinStrategyDropdownProps = Partial<IDropdownProps>

/**
 * Dropdown wrapper to list out math operations.
 */
export const JoinStrategyDropdown: React.FC<JoinStrategyDropdownProps> = memo(
	function JoinStrategyDropdown(props) {
		return (
			<Dropdown
				required
				label={'Join strategy'}
				options={options}
				styles={opDropdownStyles}
				{...props}
			/>
		)
	},
)

const options = Object.values(JoinStrategy).map(o => ({
	key: o,
	text: o,
}))
