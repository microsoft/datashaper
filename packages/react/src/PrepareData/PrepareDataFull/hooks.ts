/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import {
	TableContainer,
	Step,
	TableStore,
	Pipeline,
	introspect,
	TableMetadata,
} from '@data-wrangling-components/core'
import { BaseFile } from '@data-wrangling-components/utilities'
import ColumnTable from 'arquero/dist/types/table/column-table'
import _ from 'lodash'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { GroupedTable } from '../../'
import { useGroupedTables, usePipeline, useStore } from '../../common'

export function useBusinessLogic(
	tables: BaseFile[],
	onUpdateSteps: (steps: Step[]) => void,
	steps?: Step[],
): {
	groupedTables: GroupedTable[]
	selectedTable: TableContainer | undefined
	onSelect: (name: string) => void
	onDeleteStep: (index?: number) => void
	onSaveStep: (step: Step, index?: number) => void
	store: TableStore
	output?: TableContainer
	selectedMetadata: TableMetadata | undefined
	nextInputTable: string
} {
	const [selectedTable, setSelectedTable] = useState<TableContainer>()
	const [intermediaryTables, setIntermediaryTables] = useState<string[]>([])
	const [storedTables, setStoredTables] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	const store = useStore()
	const pipeline = usePipeline(store)

	const groupedTables = useGroupedTables(
		intermediaryTables,
		tables,
		storedTables,
	)

	const selectedMetadata = useMemo((): TableMetadata | undefined => {
		return (
			selectedTable && introspect(selectedTable?.table as ColumnTable, true)
		)
	}, [selectedTable])

	const output = useMemo((): TableContainer => {
		const name = pipeline?.last?.output
		const table = storedTables.get(name)
		return {
			name,
			table,
		} as TableContainer
	}, [pipeline, storedTables])

	const nextInputTable = useMemo((): string => {
		const _tables = store.list()
		const length = _tables.length
		const input = length === 0 ? '' : _tables[length - 1]

		return _.last(steps)?.output ?? input
	}, [steps, store])

	const runPipeline = useCallback(async () => {
		await pipeline.run()
		//todo: what about renaming the table oputput step?
		const output = await store.toMap()
		setStoredTables(output)
		setIntermediaryTables(pipeline.outputs)
	}, [pipeline, store, setStoredTables, setIntermediaryTables])

	// const clearOutputs = useCallback(async () => {
	// 	pipeline.clear()
	// 	const _output = await store.toMap()
	// 	setOutputs(_output)
	// 	setIntermediaryTables([])
	// }, [pipeline, setOutputs, setIntermediaryTables, store])

	//if steps changed, clean and run??
	// useEffect(() => {
	// 	if (steps?.length && !output?.name && !!tables.length) {
	// 		pipeline.addAll(steps)
	// 		runPipeline()
	// 	} else if (!steps?.length && output.name) {
	// 		clearOutputs()
	// 	}
	// }, [pipeline, steps, tables, runPipeline, clearOutputs, output])

	const verifyAdd = useCallback(
		async (_tables: BaseFile[]) => {
			const existing = store.list()
			const tabs = _tables.map(async table => {
				const isStored = existing.includes(table.name)
				if (!isStored) {
					const tab = await table?.toTable()
					store.set(table.name, tab)
				}
			})

			await Promise.all(tabs)
			const _storedTables = await store.toMap()
			setStoredTables(_storedTables)
		},
		[store, setStoredTables],
	)

	useEffect(() => {
		debugger
		if (tables.length) {
			verifyAdd(tables)
		} else {
			store.clear()
		}
	}, [tables, verifyAdd, store])

	const onSaveStep = useSaveStep(onUpdateSteps, pipeline, runPipeline)
	const onSelect = useOnSelect(setSelectedTable, store)
	const onDeleteStep = useDeleteStep(
		onUpdateSteps,
		pipeline,
		runPipeline,
		setSelectedTable,
		steps,
	)

	return {
		groupedTables,
		selectedTable,
		onSelect,
		onDeleteStep,
		onSaveStep,
		store,
		output,
		selectedMetadata,
		nextInputTable,
	}
}

export function useSaveStep(
	onUpdateSteps: (steps: Step[]) => void,
	pipeline: Pipeline,
	runPipeline: () => void,
): (step: Step, index?: number) => void {
	return useCallback(
		(step: Step, index?: number) => {
			if (index !== undefined) {
				onUpdateSteps(pipeline.update(step, index))
			} else {
				onUpdateSteps(pipeline.add(step))
			}
			runPipeline()
		},
		[pipeline, onUpdateSteps, runPipeline],
	)
}

export function useDeleteStep(
	onUpdateSteps: (steps: Step[]) => void,
	pipeline: Pipeline,
	runPipeline: () => void,
	setSelectedTable: (table: TableContainer | undefined) => void,
	steps?: Step[],
): (index?: number) => void {
	return useCallback(
		(index?: number) => {
			if (!steps) {
				return null
			}
			const _steps = steps && steps.slice(0, index)
			pipeline.clear()
			pipeline.addAll(_steps)
			onUpdateSteps(_steps)
			setSelectedTable(undefined)
			runPipeline()
		},
		[pipeline, onUpdateSteps, runPipeline, steps, setSelectedTable],
	)
}

export function useOnSelect(
	setSelectedTable: (table: TableContainer) => void,
	store: TableStore,
): (name: string) => void {
	return useCallback(
		async (name: string) => {
			const table = await store.get(name)
			setSelectedTable({ table, name: name })
		},
		[setSelectedTable, store],
	)
}
