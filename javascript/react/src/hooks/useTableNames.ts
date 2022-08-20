/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphWorkflow } from '@datashaper/core'
import { useCallback, useEffect, useState } from 'react'

/**
 * Creates a list of table-names from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param graph -
 * @returns
 */
export function useTableNames(graph?: GraphWorkflow): string[] {
	const [tables, setTables] = useState<string[]>([])

	const refreshInputTables = useCallback(() => {
		const newTables = [
			...(graph?.inputs.keys() ?? []),
			...(graph?.outputNames ?? []),
		]
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
