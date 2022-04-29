/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEnumDropdownOptions } from '@data-wrangling-components/react-hooks'
import type { IDropdownProps } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { opDropdownStyles } from '../styles.js'

export interface EnumDropdownProps<E = unknown>
	extends Omit<IDropdownProps, 'options'> {
	enumeration: E
	/**
	 * Optional labels to map enum keys to alternet text
	 */
	labels?: Record<string, string>
}

/**
 * Dropdown wrapper to list out aggregation operations.
 */
export const EnumDropdown: React.FC<EnumDropdownProps> = memo(
	function EnumDropdown(props) {
		const options = useEnumDropdownOptions(props.enumeration, props.labels)
		return <Dropdown options={options} styles={opDropdownStyles} {...props} />
	},
)
