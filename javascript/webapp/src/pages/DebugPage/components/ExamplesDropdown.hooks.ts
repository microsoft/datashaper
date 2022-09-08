/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow as WorkflowJson } from '@datashaper/schema'
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
import sparkbar from '../../../../public/specs/sparkbar.json'
import sparkline from '../../../../public/specs/sparkline.json'
import spreadhot from '../../../../public/specs/spreadhot.json'
import type { ExamplesDropdownProps } from './ExamplesDropdown.types.js'

const specs: Array<WorkflowJson> = [
	aggregatedLookup as unknown as WorkflowJson,
	binning as unknown as WorkflowJson,
	everyOperation as unknown as WorkflowJson,
	multistepBinarize as unknown as WorkflowJson,
	sparkbar as unknown as WorkflowJson,
	sparkline as unknown as WorkflowJson,
	categorical as unknown as WorkflowJson,
	dropdown as unknown as WorkflowJson,
	groupby as unknown as WorkflowJson,
	spreadhot as unknown as WorkflowJson,
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
