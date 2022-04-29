/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Specification,
	SpecificationInput,
	Step,
	TableStore,
	Verb,
} from '@data-wrangling-components/core'
import { createTableStore, readSpec } from '@data-wrangling-components/core'
import { usePipeline } from '@data-wrangling-components/react'
import type { BaseFile } from '@data-wrangling-components/utilities'
import type { TableContainer } from '@essex/arquero'
import { container } from '@essex/arquero'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useState } from 'react'
import { from } from 'rxjs'

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

export function useSteps(store: TableStore): {
	steps: Step[]
	result: TableContainer | undefined
	outputs: Map<string, TableContainer>
	onStepCreate: (verb: Verb) => void
	onStepChange: (step: Step, index: number) => void
	onLoadPipeline: (spec?: Specification) => void
	doRunPipeline: () => void
} {
	const [steps, setSteps] = useState<Step[]>([])
	const pipeline = usePipeline(store, steps)
	const [result, setResult] = useState<TableContainer | undefined>()
	const [outputs, setOutputs] = useState<Map<string, TableContainer>>(
		new Map<string, TableContainer>(),
	)
	const onStepCreate = useCallback(
		(verb: Verb) => {
			setSteps(pipeline.create(verb))
		},
		[pipeline, setSteps],
	)

	const onStepChange = useCallback(
		(step: Step, index: number) => setSteps(pipeline.update(step, index)),
		[setSteps, pipeline],
	)

	const doRunPipeline = useCallback(async () => {
		const res = await pipeline.run()
		const output = store.toMap()
		pipeline.print()
		store.print()
		setResult(res)
		setOutputs(output)
	}, [pipeline, store, setResult, setOutputs])

	const onLoadPipeline = useCallback(
		async (spec: Specification | undefined) => {
			pipeline.clear()
			if (spec) {
				pipeline.addAll(readSpec(spec as any))
			}
			// the pipeline will transform the steps into a consistent format - string shorthands are
			// unpacked into object forms.
			setSteps(pipeline.steps)
			const res = await pipeline.run()
			const output = store.toMap()
			store.print()
			setResult(res)
			setOutputs(output)
		},
		[pipeline, store, setSteps, setOutputs, setResult],
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
	store: TableStore
	tables: TableContainer[]
	onAddFiles: (loaded: Map<string, ColumnTable>) => void
} {
	const store = useTableStore(autoType)

	// TODO: the inputs array is only needed as a trigger to update the tables, because the store is not mutated in state
	const [inputs, setInputs] = useState<string[]>(TABLES)
	const handleAddTables = useCallback(
		(names: string[]) => setInputs(prev => [...prev, ...names]),
		[setInputs],
	)

	const [tables, setTables] = useState<TableContainer[]>([])
	useEffect(() => {
		const results = store.toArray()
		setTables(results as TableContainer[])
	}, [inputs, store, setTables])

	const onAddFiles = useCallback(
		(loaded: Map<string, ColumnTable>) => {
			loaded.forEach((table, name) => {
				store.set(name, from([{ id: name, table }]))
			})
			handleAddTables(Array.from(loaded.keys()))
		},
		[store, handleAddTables],
	)

	return {
		store,
		tables,
		onAddFiles,
	}
}

// create the store and initialize it with our test tables
// memoing this gives us a chance queue up our built-in test tables on first run
function useTableStore(autoType = false): TableStore {
	const [store, setStore] = useState<TableStore>(createTableStore())
	useEffect(() => {
		const fn = async () => {
			const store = createTableStore()
			const promises = TABLES.map(async name => {
				const data = await loadCSV(name, {
					parse,
					autoMax: 100000,
					autoType,
				})
				const ctr = container(name, data)
				store.set(name, from([ctr]))
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

export function useLoadSpecFile(): (
	file: BaseFile,
) => Promise<SpecificationInput> {
	return useCallback((file: BaseFile): Promise<SpecificationInput> => {
		return file.toJson() as any
	}, [])
}

async function readTable(file: BaseFile): Promise<[string, ColumnTable]> {
	const table = await file.toTable()
	return [file.name, table]
}
