/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	GraphManager,
	Maybe,
	Step,
	Verb,
	WorkflowObject,
} from '@data-wrangling-components/core'
import {
	createGraphManager,
	readStep,
	Workflow,
} from '@data-wrangling-components/core'
import { useGraphManager } from '@data-wrangling-components/react'
import type { BaseFile } from '@data-wrangling-components/utilities'
import type { TableContainer } from '@essex/arquero'
import { container } from '@essex/arquero'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useState } from 'react'

const TABLES = [
	`data/companies.csv`,
	`data/companies2.csv`,
	`data/products.csv`,
	'data/stocks.csv',
]

const identity = (d: any) => d

// default parsers to keep these columns as strings
const parse = {
	ID: identity,
	Group: identity,
}

export function useSteps(store: GraphManager): {
	steps: Step[]
	result: TableContainer | undefined
	outputs: Map<string, Maybe<TableContainer>>
	onStepCreate: (verb: Verb) => void
	onStepChange: (step: Step, index: number) => void
	onLoadPipeline: (spec?: WorkflowObject | undefined) => void
	doRunPipeline: () => void
} {
	const [steps, setSteps] = useState<Step[]>([])
	const graph = useGraphManager([])
	// TODO: use observable to subscribe into the result table
	const [result, setResult] = useState<Maybe<TableContainer>>()
	const [outputs, setOutputs] = useState<Map<string, Maybe<TableContainer>>>(
		new Map<string, TableContainer>(),
	)

	const onStepCreate = useCallback(
		(verb: Verb) => {
			const newStep = readStep({ verb })
			graph.addStep(newStep)
			setSteps(graph.steps)
		},
		[graph, setSteps],
	)

	const onStepChange = useCallback(
		(step: Step, index: number) => {
			graph.reconfigureStep(index, step)
			setSteps(graph.steps)
		},
		[setSteps, graph],
	)

	const doRunPipeline = useCallback(() => {
		graph.print()
		store.print()
		// todo: what should the "result" be?
		setResult(graph.latest(graph.outputs[0]))
		setOutputs(graph.toMap())
	}, [graph, store, setResult, setOutputs])

	const onLoadPipeline = useCallback(
		(spec: WorkflowObject | undefined) => {
			const workflow = spec ? new Workflow(spec) : undefined
			graph.reset(workflow)

			setSteps(graph.steps)
			// const res = await graph.run()
			// const output = store.toMap()
			store.print()
			setResult(graph.latest(graph.outputs[0]))
			setOutputs(store.toMap())
		},
		[graph, store, setSteps, setOutputs, setResult],
	)

	return {
		steps,
		result,
		outputs,
		onStepCreate,
		onStepChange,
		onLoadPipeline,
		doRunPipeline,
	}
}
export function useTables(autoType = false): {
	store: GraphManager
	tables: TableContainer[]
	onAddFiles: (loaded: Map<string, ColumnTable>) => void
} {
	const store = useTableStore(autoType)

	const [tables, setTables] = useState<TableContainer[]>([])

	// initialize the input tables when the store is created
	useEffect(() => {
		const results = store.toList()
		setTables(results as TableContainer[])
	}, [store, setTables])

	// add any dropped files to the inputs
	const onAddFiles = useCallback(
		(loaded: Map<string, ColumnTable>) => {
			for (const [id, table] of loaded.entries()) {
				store.addInput({ id, table })
			}
		},
		[store],
	)

	return {
		store,
		tables,
		onAddFiles,
	}
}

// create the store and initialize it with our test tables
// memoing this gives us a chance queue up our built-in test tables on first run
function useTableStore(autoType = false): GraphManager {
	const [store, setStore] = useState<GraphManager>(createGraphManager())
	useEffect(() => {
		const fn = async () => {
			const store = createGraphManager()
			const promises = TABLES.map(async name => {
				const data = await loadCSV(name, {
					parse,
					autoMax: 100000,
					autoType,
				})
				const ctr = container(name, data)
				store.inputs.set(name, ctr)
			})
			await Promise.all(promises)
			setStore(store)
		}
		void fn()
	}, [autoType])
	return store
}

export function useLoadTableFiles(): (
	files: BaseFile[],
) => Promise<Map<string, ColumnTable>> {
	return useCallback(
		async (files: BaseFile[]): Promise<Map<string, ColumnTable>> => {
			const list = await Promise.all(files.map(readTable))
			return list.reduce((acc, cur) => {
				acc.set(cur[0], cur[1])
				return acc
			}, new Map<string, ColumnTable>())
		},
		[],
	)
}

export function useLoadSpecFile(): (file: BaseFile) => Promise<WorkflowObject> {
	return useCallback((file: BaseFile): Promise<WorkflowObject> => {
		return file.toJson() as Promise<WorkflowObject>
	}, [])
}

async function readTable(file: BaseFile): Promise<[string, ColumnTable]> {
	const table = await file.toTable()
	return [file.name, table]
}
