/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Step,
	TableStore,
	TableMetadata,
	TableContainer,
} from '@data-wrangling-components/core'
import { introspect } from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
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
	setSelectedTableId: (id: string) => void
	onDeleteStep: (index: number) => void
	onSaveStep: (step: Step, index?: number) => void
	store: TableStore
	selectedMetadata: TableMetadata | undefined
	lastTableName: string
	selectedTableName?: string
	derived: TableContainer[]
} {
	const [selectedTableId, setSelectedTableId] = useState<string>()
	const [storedTables, setStoredTables] = useState<Map<string, TableContainer>>(
		new Map<string, TableContainer>(),
	)
	const store = useStore()
	const pipeline = usePipeline(store)
	const runPipeline = useRunPipeline(
		pipeline,
		setStoredTables,
		setSelectedTableId,
	)
	const addNewTables = useAddNewTables(store, setStoredTables)

	// TODO: resolve these from the stored table state
	const derived = useMemo(() => {
		const unique = new Set<string>()
		steps?.forEach(step => unique.add(step.output))
		return Array.from(unique).map(name => ({
			id: name,
		}))
	}, [steps])

	const selectedTableContainer = useMemo((): TableContainer | undefined => {
		return Array.from(storedTables.values()).find(x => x.id === selectedTableId)
	}, [selectedTableId, storedTables])

	const selectedTableName = useMemo((): string => {
		return selectedTableContainer?.name || ''
	}, [selectedTableContainer])

	const selectedTable = useMemo((): ColumnTable | undefined => {
		return selectedTableContainer?.table
	}, [selectedTableContainer])

	const selectedMetadata = useMemo((): TableMetadata | undefined => {
		return selectedTable && introspect(selectedTable, true)
	}, [selectedTable])

	// kind of a complex selection process:
	// 1) if a table is selected in the tables dropdown, use that
	// 2) if there are derived tables, use the last one
	// 3) if the store tables do not have any derived, use the first input
	const lastTableName = useMemo((): string => {
		if (selectedTableName) {
			return selectedTableName
		}
		if (derived && derived.length > 0) {
			const last = derived[derived.length - 1]
			if (last) {
				return last.id
			}
		}
		return tables[0]?.id || ''
	}, [tables, selectedTableName, derived])

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
		setSelectedTableId,
		onDeleteStep,
		onSaveStep,
		store,
		selectedMetadata,
		lastTableName,
		selectedTableName,
		derived,
	}
}
