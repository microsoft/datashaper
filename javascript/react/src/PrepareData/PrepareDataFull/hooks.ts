/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Step,
	TableStore,
	introspect,
	TableMetadata,
	TableContainer,
} from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import last from 'lodash-es/last.js'
import { useState, useMemo, useEffect } from 'react'
import { usePipeline, useStore } from '../../common/index.js'
import {
	useOnDeleteStep,
	useOnSaveStep,
	useRunPipeline,
	useAddNewTables,
} from '../hooks'

export function useBusinessLogic(
	tables: TableContainer[],
	onUpdateSteps: (steps: Step[]) => void,
	steps?: Step[],
): {
	selectedTable: ColumnTable | undefined
	setSelectedTableName: (name: string) => void
	onDeleteStep: (index: number) => void
	onSaveStep: (step: Step, index?: number) => void
	store: TableStore
	selectedMetadata: TableMetadata | undefined
	lastTableName: string
	selectedTableName?: string
	derived: TableContainer[]
} {
	const [selectedTableName, setSelectedTableName] = useState<string>()
	const [storedTables, setStoredTables] = useState<Map<string, TableContainer>>(
		new Map<string, TableContainer>(),
	)
	const store = useStore()
	const pipeline = usePipeline(store)
	const runPipeline = useRunPipeline(
		pipeline,
		setStoredTables,
		setSelectedTableName,
	)
	const addNewTables = useAddNewTables(store, setStoredTables)

	const selectedTable = useMemo((): ColumnTable | undefined => {
		return storedTables.get(selectedTableName ?? '')?.table
	}, [selectedTableName, storedTables])

	const selectedMetadata = useMemo((): TableMetadata | undefined => {
		return selectedTable && introspect(selectedTable, true)
	}, [selectedTable])

	const lastTableName = useMemo((): string => {
		const _tables = Array.from(storedTables.keys())
		const length = _tables.length
		const input = length === 0 ? '' : _tables[length - 1] ?? ''
		return last(steps)?.output ?? input
	}, [steps, storedTables])

	// TODO: resolve these from the stored table state
	const derived = useMemo(() => {
		const unique = new Set<string>()
		steps?.forEach(step => unique.add(step.output))
		return Array.from(unique).map(name => ({
			id: name,
		}))
	}, [steps])

	useEffect(() => {
		const f = async () => {
			runPipeline()
		}
		f()
	}, [steps, runPipeline])

	useEffect(() => {
		if (steps?.length && storedTables.size > 0) {
			if (steps && !pipeline.steps.filter(s => steps?.includes(s)).length) {
				pipeline.addAll(steps)
				runPipeline()
			}
		}
	}, [steps, pipeline, runPipeline, storedTables])

	useEffect(() => {
		if (tables.length) {
			addNewTables(tables)
		}
	}, [tables, addNewTables])

	const onSaveStep = useOnSaveStep(onUpdateSteps, pipeline)
	const onDeleteStep = useOnDeleteStep(onUpdateSteps, pipeline)

	return {
		selectedTable,
		setSelectedTableName,
		onDeleteStep,
		onSaveStep,
		store,
		selectedMetadata,
		lastTableName,
		selectedTableName,
		derived,
	}
}
