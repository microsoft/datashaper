/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowObject } from '@data-wrangling-components/core'
import { Workflow } from '@data-wrangling-components/core'
import type { IDropdownOption } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import type { ExamplesDropdownProps } from './ExamplesDropdown.types.js'
import aggregatedLookup from './specs/aggregated-lookup.json'
import binning from './specs/binning.json'
import categorical from './specs/categorical.json'
import dropdown from './specs/dropdown.json'
import everyOperation from './specs/every-operation.json'
import groupby from './specs/groupby.json'
import multistepBinarize from './specs/multistep-binarize.json'
import sparkbar from './specs/sparkbar.json'
import sparkline from './specs/sparkline.json'

const specs: Array<WorkflowObject> = [
	aggregatedLookup as unknown as WorkflowObject,
	binning as unknown as WorkflowObject,
	everyOperation as unknown as WorkflowObject,
	multistepBinarize as unknown as WorkflowObject,
	sparkbar as unknown as WorkflowObject,
	sparkline as unknown as WorkflowObject,
	categorical as unknown as WorkflowObject,
	dropdown as unknown as WorkflowObject,
	groupby as unknown as WorkflowObject,
]

export function useExampleOptions(): IDropdownOption[] {
	return useMemo(
		() =>
			specs.map(spec => ({
				key: `${spec.name}`,
				text: `${spec.name}`,
			})),
		[],
	)
}

export function useOnSelectOption(
	onChange: ExamplesDropdownProps['onChange'],
): (key: string) => void {
	return useCallback(
		(key: string) => {
			if (onChange) {
				const found = specs.find(s => s.name === key)
				if (found) {
					onChange(new Workflow(found))
				}
			}
		},
		[onChange],
	)
}
