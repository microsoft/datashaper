/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { useEnumDropdownOptions } from './EnumDropdown.hooks.js'
import { opDropdownStyles } from './EnumDropdown.styles.js'
import type { EnumDropdownProps } from './EnumDropdown.types.js'

/**
 * Dropdown wrapper to list out aggregation operations.
 */
export const EnumDropdown: React.FC<EnumDropdownProps> = memo(
	function EnumDropdown(props) {
		const options = useEnumDropdownOptions(props.enumeration, props.labels)
		return <Dropdown options={options} styles={opDropdownStyles} {...props} />
	},
)
