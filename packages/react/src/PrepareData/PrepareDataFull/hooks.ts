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
import ColumnTable from 'arquero/dist/types/table/column-table'
import _ from 'lodash'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { GroupedTable } from '../../'
import { useGroupedTables, usePipeline, useStore } from '../../common'

export function useBusinessLogic(
	tables: TableContainer[],
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
	const [outputs, setOutputs] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	const store = useStore()
	const pipeline = usePipeline(store)

	const groupedTables = useGroupedTables(intermediaryTables, tables, outputs)
	console.log(groupedTables)
	const selectedMetadata = useMemo((): TableMetadata | undefined => {
		return (
			selectedTable && introspect(selectedTable?.table as ColumnTable, true)
		)
	}, [selectedTable])

	const output = useMemo((): TableContainer => {
		const name = pipeline?.last?.output
		const table = outputs.get(name)
		return {
			name,
			table,
		} as TableContainer
	}, [pipeline, outputs])

	const nextInputTable = useMemo((): string => {
		const tables = store.list()
		const length = tables.length
		const input = length === 0 ? '' : tables[length - 1]

		return _.last(steps)?.output ?? input
	}, [steps, store])

	const runPipeline = useCallback(async () => {
		await pipeline.run()
		//todo: what about renaming the table oputput step?
		const output = await store.toMap()
		setOutputs(output)
		setIntermediaryTables(pipeline.outputs)
	}, [pipeline, store, setOutputs, setIntermediaryTables])

	useEffect(() => {
		if (steps?.length && !outputs?.size && !!tables.length) {
			pipeline.addAll(steps)
			runPipeline()
		}
	}, [pipeline, steps, tables, runPipeline, outputs])

	useEffect(() => {
		tables.forEach(async table => {
			try {
				//what if it's different
				//what if it's a delete
				await store.get(table.name)
			} catch (e) {
				store.set(table.name, table?.table as ColumnTable)
				const output = await store.toMap()
				setOutputs(output)
			}
		})
	}, [tables, store, setOutputs])

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
