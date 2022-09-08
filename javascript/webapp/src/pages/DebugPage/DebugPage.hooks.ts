/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useHandleStepSave } from '@datashaper/react'
import type { Verb } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { container } from '@datashaper/tables'
import type { Step, Workflow } from '@datashaper/workflow'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useMemo, useState } from 'react'

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
 * @param workflow - the workflow instance
 * @returns
 */
export function useCreateStepHandler(workflow: Workflow): (verb: Verb) => void {
	const saveStep = useHandleStepSave(workflow)
	return useCallback(
		(verb: Verb) => saveStep({ verb } as Step, workflow.steps.length),
		[saveStep, workflow],
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
 * @param workflow - the input graph
 * @returns The graph and a callback to update the input tables
 */
export function useAddFilesHandler(
	workflow: Workflow,
): (loaded: TableContainer[]) => void {
	// add any dropped files to the inputs
	return useCallback(
		(loaded: TableContainer[]) => {
			loaded.forEach(table => workflow.addInputTable(table))
		},
		[workflow],
	)
}

function readCsvFile(name: string, autoType: boolean): Promise<ColumnTable> {
	return loadCSV(name, {
		autoMax: 100000,
		autoType,
	})
}
