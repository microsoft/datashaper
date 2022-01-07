/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Specification } from '@data-wrangling-components/core'
import { Dropdown } from '@fluentui/react'
import React, { memo, useCallback, useMemo, useState } from 'react'
import aggregatedLookup from './specs/aggregated-lookup.json'
import binning from './specs/binning.json'
import categorical from './specs/categorical.json'
import compoundBinarize from './specs/compound-binarize.json'
import dropdown from './specs/dropdown.json'
import everyOperation from './specs/every-operation.json'
import groupby from './specs/groupby.json'
import multistepBinarize from './specs/multistep-binarize.json'
import sparkbar from './specs/sparkbar.json'
import sparkline from './specs/sparkline.json'

export interface ExamplesDropdownProps {
	onChange?: (spec: Specification | undefined) => void
}

const specs: Array<Specification> = [
	aggregatedLookup as unknown as Specification,
	binning as unknown as Specification,
	compoundBinarize as unknown as Specification,
	everyOperation as unknown as Specification,
	multistepBinarize as unknown as Specification,
	sparkbar as unknown as Specification,
	sparkline as unknown as Specification,
	categorical as unknown as Specification,
	dropdown as unknown as Specification,
	groupby as unknown as Specification,
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
				if (onChange) {
					const found = specs.find(s => s.name === opt.key)
					if (found) {
						onChange(found)
					}
				}
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
