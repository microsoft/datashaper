/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'

import { getSimpleDropdownOptions } from '../fluent/useSimpleDropdownOptions.js'
import { useWorkflowInputTableNames } from '../workflow/useWorkflowInputTableNames.js'

/**
 * Creates a dropdown list of id-names from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param workflow -
 * @returns
 */
export function useTableDropdownOptions(
	workflow?: Workflow,
	filter?: (element: string, index: number, array: string[]) => boolean,
): IDropdownOption[] {
	const inputNames = useWorkflowInputTableNames(workflow)
	return useMemo(() => {
		let combined = inputNames
		if (workflow) {
			combined = combined.concat(workflow.outputNames)
		}
		if (filter) {
			combined = combined.filter(filter)
		}
		const inputOptions = getSimpleDropdownOptions(combined)
		return inputOptions
	}, [inputNames, workflow, filter])
}
