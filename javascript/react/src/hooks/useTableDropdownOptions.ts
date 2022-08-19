/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@datashaper/core'
import type { IDropdownOption } from '@fluentui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { getSimpleDropdownOptions } from './useSimpleDropdownOptions.js'

/**
 * Creates a dropdown list of id-names from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param graph -
 * @returns
 */
export function useTableDropdownOptions(
	graph?: GraphManager,
): IDropdownOption[] {
	const inputNames = useInputTableNames(graph)

	return useMemo(() => {
		let inputOptions = getSimpleDropdownOptions(inputNames)
		if (graph) {
			inputOptions = inputOptions.concat(
				graph?.outputDefinitions.map(a => ({
					key: a.node,
					text: a.name,
				})),
			)
		}

		return inputOptions
	}, [inputNames, graph])
}

function useInputTableNames(graph?: GraphManager): string[] {
	const [tables, setTables] = useState<string[]>([])

	const refreshInputTables = useCallback(() => {
		const newTables = [...(graph?.inputs.keys() ?? [])]
		setTables(newTables)
	}, [graph, setTables])

	// Listen to input table changes
	useEffect(
		() => graph?.onChange(refreshInputTables),
		[graph, refreshInputTables],
	)

	// Initialize input tables on initial render
	useEffect(() => refreshInputTables(), [refreshInputTables])
	return tables
}
