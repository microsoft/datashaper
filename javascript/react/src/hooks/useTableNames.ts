/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@datashaper/core'
import { useEffect, useState } from 'react'

/**
 * Creates a list of table-names from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param graph -
 * @returns
 */
export function useTableNames(graph?: GraphManager): string[] {
	const [tables, setTables] = useState<string[]>(() => getTableOptions(graph))

	// Listen to input table changes
	useEffect(
		() =>
			graph?.onChange(() => {
				setTables(getTableOptions(graph))
			}),
		[graph],
	)

	return tables
}

function getTableOptions(graph?: GraphManager): string[] {
	const result = new Set<string>(graph?.inputs.keys())
	graph?.outputs.forEach(o => result.add(o))
	return [...result.values()]
}
