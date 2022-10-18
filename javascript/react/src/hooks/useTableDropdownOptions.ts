/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'
import { useEffect, useMemo, useState } from 'react'

import { getSimpleDropdownOptions } from './useSimpleDropdownOptions.js'

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
): IDropdownOption[] {
	const inputNames = useInputTableNames(workflow)

	return useMemo(() => {
		let inputOptions = getSimpleDropdownOptions(inputNames)
		if (workflow) {
			inputOptions = inputOptions.concat(
				workflow?.outputDefinitions.map(a => ({
					key: a.node,
					text: a.name,
				})),
			)
		}

		return inputOptions
	}, [inputNames, workflow])
}

/**
 * Creates a dropdown list of id-names from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param workflow -
 * @returns
 */
export function useInputTableNames(workflow?: Workflow): string[] {
	const [tables, setTables] = useState<string[]>(() =>
		getTableOptions(workflow),
	)

	// Listen to input table changes
	useEffect(
		() =>
			workflow?.onChange(() => {
				setTables(getTableOptions(workflow))
			}),
		[workflow],
	)

	return tables
}

function getTableOptions(workflow?: Workflow): string[] {
	return workflow?.inputNames ?? []
}
