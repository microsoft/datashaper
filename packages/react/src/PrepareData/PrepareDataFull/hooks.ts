/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import {
	Step,
	TableStore,
	Pipeline,
	introspect,
	TableMetadata,
} from '@data-wrangling-components/core'
import { BaseFile } from '@data-wrangling-components/utilities'
import { useBoolean } from '@fluentui/react-hooks'
import ColumnTable from 'arquero/dist/types/table/column-table'
import _ from 'lodash'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { GroupedTable } from '../../'
import { useGroupedTables, usePipeline, useStore } from '../../common'

export function useBusinessLogic(
	files: BaseFile[],
	onUpdateSteps: (steps: Step[]) => void,
	onDeleteFile: (name: string) => void,
	onUpdateOutputTable?: (table?: ColumnTable) => void,
	steps?: Step[],
): {
	groupedTables: GroupedTable[]
	selectedTable: ColumnTable | undefined
	onSelectTable: (name: string) => void
	onDeleteTable: (name: string) => void
	onDeleteStep: (index?: number) => void
	onSaveStep: (step: Step, index?: number) => void
	store: TableStore
	selectedMetadata: TableMetadata | undefined
	lastTableName: string
	isLoadingList: boolean
	output?: ColumnTable
	selectedTableName?: string
} {
	const [selectedTable, setSelectedTable] = useState<ColumnTable>()
	const [selectedTableName, setSelectedTableName] = useState<string>()
	const [
		isLoadingList,
		{ setTrue: setLoadingListTrue, setFalse: setLoadingListFalse },
	] = useBoolean(false)
	const [intermediaryTables, setIntermediaryTables] = useState<string[]>([])
	const [storedTables, setStoredTables] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	const store = useStore()
	const pipeline = usePipeline(store)

	const groupedTables = useGroupedTables(intermediaryTables, storedTables)

	const selectedMetadata = useMemo((): TableMetadata | undefined => {
		return selectedTable && introspect(selectedTable, true)
	}, [selectedTable])

	const output = useMemo((): ColumnTable | undefined => {
		const name = pipeline?.last?.output
		const table = storedTables.get(name)
		onUpdateOutputTable && onUpdateOutputTable(table)
		return table
	}, [pipeline, storedTables])

	const lastTableName = useMemo((): string => {
		const _tables = store.list()
		const length = _tables.length
		const input = length === 0 ? '' : _tables[length - 1]

		return _.last(steps)?.output ?? input
	}, [steps, store])

	const runPipeline = useCallback(async () => {
		if (pipeline.steps.length) {
			await pipeline.run()
		}

		const output = await store.toMap()
		setStoredTables(output)
		setIntermediaryTables(pipeline.outputs)
	}, [pipeline, store, setStoredTables, setIntermediaryTables])

	const clearOutputs = useCallback(async () => {
		pipeline.clear()
		const _output = await store.toMap()
		setStoredTables(_output)
		setIntermediaryTables([])
	}, [pipeline, setStoredTables, setIntermediaryTables, store])

	useEffect(() => {
		if (steps?.length && !output && storedTables.size > 0) {
			pipeline.addAll(steps)
			runPipeline()
		} else if (!steps?.length && output) {
			clearOutputs()
		}
	}, [steps, pipeline, runPipeline, storedTables, output, clearOutputs])

	const verifyAdd = useCallback(
		async (files: BaseFile[]) => {
			setLoadingListTrue()
			const existing = store.list()
			const tabs = files.map(async file => {
				const isStored = existing.includes(file.name)
				if (!isStored) {
					const tab = await file?.toTable()
					store.set(file.name, tab)
				}
			})

			await Promise.all(tabs)
			const _storedTables = await store.toMap()
			setStoredTables(_storedTables)
			setLoadingListFalse()
		},
		[store, setStoredTables, setLoadingListFalse, setLoadingListTrue],
	)

	useEffect(() => {
		if (files.length) {
			verifyAdd(files)
		} else {
			store.clear()
		}
	}, [files, verifyAdd, store])

	const onSaveStep = useSaveStep(onUpdateSteps, pipeline, runPipeline)
	const onSelectTable = useOnSelect(
		setSelectedTable,
		setSelectedTableName,
		store,
	)

	//if delete table or step that is selected, set as null
	const onDeleteTable = useOnDeleteTable(
		store,
		setSelectedTable,
		selectedTableName,
		onDeleteFile,
		setStoredTables,
	)
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
		onSelectTable,
		onDeleteTable,
		onDeleteStep,
		onSaveStep,
		store,
		output,
		selectedMetadata,
		lastTableName,
		isLoadingList,
		selectedTableName,
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
	setSelectedTable: (table: ColumnTable | undefined) => void,
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
	setSelectedTable: (table: ColumnTable) => void,
	setSelectedTableName: (name: string) => void,
	store: TableStore,
): (name: string) => void {
	return useCallback(
		async (name: string) => {
			const table = await store.get(name)
			setSelectedTable(table)
			setSelectedTableName(name)
		},
		[setSelectedTable, setSelectedTableName, store],
	)
}

export function useOnDeleteTable(
	store: TableStore,
	setSelectedTable: (table: ColumnTable | undefined) => void,
	selectedTableName: string | undefined,
	onDeleteFile: (name: string) => void,
	setStoredTables: (table: Map<string, ColumnTable>) => void,
): (tableName: string) => void {
	return useCallback(
		async (tableName: string) => {
			store.delete(tableName)
			const _storedTables = await store.toMap()
			onDeleteFile(tableName)
			if (selectedTableName === tableName) {
				setSelectedTable(undefined)
			}
			setStoredTables(_storedTables)
		},
		[store, setStoredTables, onDeleteFile, selectedTableName, setSelectedTable],
	)
}
