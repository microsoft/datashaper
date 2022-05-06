/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { dropdownStyles } from '../styles.js'
import type { MultiDropdownProps } from './MultiDropdown.types.js'
import { useDropdownOptions, useOptionRenderer } from './MultiDropdown.hooks.js'

/**
 * Dropdown wrapper to manage multi-select with a select all/none helper.
 */
export const MultiDropdown: React.FC<MultiDropdownProps> = memo(
	function MultiDropdown({
		options,
		selectedKeys,
		onSelectAllOrNone,
		...props
	}) {
		const opts = useDropdownOptions(options, selectedKeys)
		const handleRenderOption = useOptionRenderer(options, onSelectAllOrNone)

		return (
			<Dropdown
				required
				multiSelect
				options={opts}
				selectedKeys={selectedKeys}
				styles={dropdownStyles}
				onRenderOption={handleRenderOption}
				{...props}
			/>
		)
	},
)
