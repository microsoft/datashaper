/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowSchema } from '@datashaper/schema'
import { Workflow } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import aggregatedLookup from '../../../../public/specs/aggregated-lookup.json'
import binning from '../../../../public/specs/binning.json'
import categorical from '../../../../public/specs/categorical.json'
import dropdown from '../../../../public/specs/dropdown.json'
import everyOperation from '../../../../public/specs/every-operation.json'
import groupby from '../../../../public/specs/groupby.json'
import multistepBinarize from '../../../../public/specs/multistep-binarize.json'
import onehotunhot from '../../../../public/specs/onehot-unhot.json'
import sparkbar from '../../../../public/specs/sparkbar.json'
import sparkline from '../../../../public/specs/sparkline.json'
import spreadhot from '../../../../public/specs/spreadhot.json'
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
