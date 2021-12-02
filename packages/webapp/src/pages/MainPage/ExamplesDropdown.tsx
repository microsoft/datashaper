/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Specification } from '@data-wrangling-components/core'
import { Dropdown } from '@fluentui/react'
import React, { memo, useCallback, useMemo, useState } from 'react'
import aggregatedLookup from './specs/aggregated-lookup.json'
import compoundBinarize from './specs/compound-binarize.json'
import everyOperation from './specs/every-operation.json'
import multistepBinarize from './specs/multistep-binarize.json'

export interface ExamplesDropdownProps {
	onChange?: (spec: Specification | undefined) => void
}

const specs = [
	aggregatedLookup as any,
	compoundBinarize as any,
	everyOperation as any,
	multistepBinarize as any,
]

export const ExamplesDropdown: React.FC<ExamplesDropdownProps> = memo(
	function ExamplesDropdown({ onChange }) {
		const options = useMemo(
			() =>
				specs.map(spec => ({
					key: `${spec.name}`,
					text: `${spec.name}`,
				})),
			[],
		)
		const [currentOption, setCurrentOption] = useState<string | undefined>()
		const handleDropdownChange = useCallback(
			(e, opt) => {
				setCurrentOption(opt.key)
				onChange && onChange(specs.find(s => s.name === opt.key))
			},
			[onChange],
		)

		return (
			<Dropdown
				placeholder={'Select pre-built example'}
				options={options}
				selectedKey={currentOption}
				styles={{ root: { width: 200 } }}
				onChange={handleDropdownChange}
			/>
		)
	},
)
