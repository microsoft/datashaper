/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo, useCallback, useState } from 'react'

import {
	useExampleOptions,
	useOnSelectOption,
} from './ExamplesDropdown.hooks.js'
import { dropdownStyles } from './ExamplesDropdown.styles.js'
import type { ExamplesDropdownProps } from './ExamplesDropdown.types.js'

export const ExamplesDropdown: React.FC<ExamplesDropdownProps> = memo(
	function ExamplesDropdown({ onChange }) {
		const options = useExampleOptions()
		const [currentOption, setCurrentOption] = useState<string | undefined>()
		const handleOptionSelected = useOnSelectOption(onChange)
		const handleDropdownChange = useCallback(
			(_e: any, opt: IDropdownOption<any> | undefined) => {
				if (opt) {
					setCurrentOption(opt.key as string)
					handleOptionSelected(opt.key as string)
				}
			},
			[setCurrentOption, handleOptionSelected],
		)

		return (
			<Dropdown
				placeholder={'Select pre-built example'}
				options={options}
				selectedKey={currentOption}
				styles={dropdownStyles}
				onChange={handleDropdownChange}
			/>
		)
	},
)
