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

const identity = (d: any) => d

// default parsers to keep these columns as strings
const parse = {
	ID: identity,
	Group: identity,
}

export function useSteps(graph: GraphManager) {
	const [steps, setSteps] = useState<Step[]>([])
	// listen for graph changes and update the steps
	useEffect(
		() => graph.onChange(() => setSteps(graph.steps)),
		[graph, setSteps],
	)
	return steps
}

export function useStepsxx(graph: GraphManager): {
	steps: Step[]
	result: TableContainer | undefined
	outputs: Map<string, Maybe<TableContainer>>
	onStepCreate: (verb: Verb) => void
	onStepChange: (step: Step, index: number) => void
	onLoadPipeline: (spec?: WorkflowObject | undefined) => void
	doRunPipeline: () => void
} {
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
		// todo: what should the "result" be?
		setResult(graph.latest(graph.outputs[0]))
		setOutputs(graph.toMap())
	}, [graph, setResult, setOutputs])

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

export function useInitialData(autoType = false): {
	graph: GraphManager
	tables: TableContainer[]
	onAddFiles: (loaded: TableContainer[]) => void
} {
	const graph = useLoadedGraphManager(autoType)
	const [tables, setTables] = useState<TableContainer[]>([])

	// initialize the input tables when the store is created
	useEffect(() => {
		setTables(graph.toList().filter(t => !!t) as TableContainer[])
		return graph.onChange(() => {
			setTables(graph.toList().filter(t => !!t) as TableContainer[])
		})
	}, [graph, setTables])

	// add any dropped files to the inputs
	const onAddFiles = useCallback(
		(loaded: TableContainer[]) => {
			loaded.forEach(table => graph.addInput(table))
		},
		[graph],
	)

	return {
		graph,
		tables,
		onAddFiles,
	}
}

// create the store and initialize it with our test tables
// memoing this gives us a chance queue up our built-in test tables on first run
function useLoadedGraphManager(autoType = false): GraphManager {
	const graph = useGraphManager()
	useEffect(() => {
		const fn = async () => {
			const promises = TABLES.map(async name => {
				const data = await readCsvFile(name, autoType)
				const ctr = container(name, data)
				graph.addInput(ctr)
			})
			await Promise.all(promises)
		}
		void fn()
	}, [autoType])
	return graph
}

const TABLES = [
	`data/companies.csv`,
	`data/companies2.csv`,
	`data/products.csv`,
	'data/stocks.csv',
]

export function useLoadTableFiles(): (
	files: BaseFile[],
) => Promise<TableContainer[]> {
	return useCallback(
		(files: BaseFile[]): Promise<TableContainer[]> =>
			Promise.all(files.map(readTable)),
		[],
	)
}

export function useLoadSpecFile(): (file: BaseFile) => Promise<WorkflowObject> {
	return useCallback((file: BaseFile): Promise<WorkflowObject> => {
		return file.toJson() as Promise<WorkflowObject>
	}, [])
}

async function readTable(file: BaseFile): Promise<TableContainer> {
	const table = await file.toTable()
	return { name: file.name, id: file.name, table }
}

function readCsvFile(name: string, autoType: boolean): Promise<ColumnTable> {
	return loadCSV(name, {
		parse,
		autoMax: 100000,
		autoType,
	})
}
