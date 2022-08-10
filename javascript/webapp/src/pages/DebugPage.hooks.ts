/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Step, Verb, Workflow } from '@datashaper/core'
import { useHandleStepSave } from '@datashaper/react'
import type { TableContainer } from '@essex/arquero'
import { container } from '@essex/arquero'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useMemo, useState } from 'react'

const identity = (d: any) => d

// default parsers to keep these columns as strings
const parse = {
	ID: identity,
	Group: identity,
}

export function useWorkflowDownloadUrl(workflow: Workflow | undefined): string {
	const [serialized, setSerialized] = useState<Blob>(
		new Blob([workflowToJson(workflow)]),
	)
	useEffect(() => {
		return workflow?.onChange(() =>
			setSerialized(new Blob([workflowToJson(workflow)])),
		)
	}, [workflow])

	return useMemo(() => URL.createObjectURL(serialized), [serialized])
}

function workflowToJson(workflow: Workflow | undefined) {
	const o = workflow?.toJsonObject() ?? {}
	return JSON.stringify(o, null, 4)
}

/**
 *
 * @param graph - the graph manager
 * @returns
 */
export function useCreateStepHandler(
	graph: GraphManager,
): (verb: Verb) => void {
	const saveStep = useHandleStepSave(graph)
	return useCallback(
		(verb: Verb) => saveStep({ verb } as Step, graph.steps.length),
		[saveStep, graph],
	)
}

/**
 * Load the initial input tables
 * @param autoType - Whether to auto-type the columns when reading the file
 * @returns A set of table containers representing the initial dataset
 */
export function useInputTables(autoType = false): TableContainer[] {
	const [tables, setTables] = useState<TableContainer[]>([])

	useEffect(() => {
		const fn = async () => {
			const promises = [
				`data/companies.csv`,
				`data/companies2.csv`,
				`data/products.csv`,
				'data/stocks.csv',
			].map(async name => {
				const data = await readCsvFile(name, autoType)
				return container(name, data)
			})
			const loadedTables = await Promise.all(promises)
			setTables(loadedTables)
		}
		void fn()
	}, [autoType])

	return tables
}

/**
 * Gets a callback for handling adding files to the graph
 * @param graph - the input graph
 * @returns The graph and a callback to update the input tables
 */
export function useAddFilesHandler(
	graph: GraphManager,
): (loaded: TableContainer[]) => void {
	// add any dropped files to the inputs
	return useCallback(
		(loaded: TableContainer[]) => {
			loaded.forEach(table => graph.addInput(table))
		},
		[graph],
	)
}

function readCsvFile(name: string, autoType: boolean): Promise<ColumnTable> {
	return loadCSV(name, {
		parse,
		autoMax: 100000,
		autoType,
	})
}
