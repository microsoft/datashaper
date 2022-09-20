/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowSchema } from '@datashaper/schema'
import { Workflow } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import aggregatedLookup from '../../specs/aggregated-lookup.json'
import binning from '../../specs/binning.json'
import categorical from '../../specs/categorical.json'
import dropdown from '../../specs/dropdown.json'
import everyOperation from '../../specs/every-operation.json'
import groupby from '../../specs/groupby.json'
import multistepBinarize from '../../specs/multistep-binarize.json'
import onehotunhot from '../../specs/onehot-unhot.json'
import sparkbar from '../../specs/sparkbar.json'
import sparkline from '../../specs/sparkline.json'
import spreadhot from '../../specs/spreadhot.json'
import type { ExamplesDropdownProps } from './ExamplesDropdown.types.js'

const specs: Array<WorkflowSchema> = [
	aggregatedLookup as unknown as WorkflowSchema,
	binning as unknown as WorkflowSchema,
	everyOperation as unknown as WorkflowSchema,
	multistepBinarize as unknown as WorkflowSchema,
	sparkbar as unknown as WorkflowSchema,
	sparkline as unknown as WorkflowSchema,
	categorical as unknown as WorkflowSchema,
	dropdown as unknown as WorkflowSchema,
	groupby as unknown as WorkflowSchema,
	spreadhot as unknown as WorkflowSchema,
	onehotunhot as unknown as WorkflowSchema,
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
