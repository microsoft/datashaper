/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableStore } from '@data-wrangling-components/core'
import type { TableContainer, TableMetadata } from '@essex/arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useMemo, useState } from 'react'

import { usePipeline, useStore } from '../../common/index.js'
import {
	getLoadingOrchestrator,
	LoadingOrchestratorType,
} from '../../Orchestrator/index.js'
import {
	useAddNewTables,
	useOnDeleteStep,
	useOnSaveStep,
	useOnUpdateMetadata,
	useRunPipeline,
} from '../hooks/index.js'

export function useBusinessLogic(
	tables: TableContainer[],
	onUpdateSteps: (steps: Step[]) => void,
	steps?: Step[],
	onOutputTable?: (table: TableContainer) => void,
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
	onUpdateMetadata: (meta: TableMetadata) => void
	tablesLoading: boolean
} {
	const [selectedTableName, setSelectedTableName] = useState<string>()
	const [storedTables, setStoredTables] = useState<Map<string, TableContainer>>(
		new Map<string, TableContainer>(),
	)

	const store = useStore()

	useEffect(() => {
		store.onChange(() => {
			// we need to create a new map to trigger memo update
			const _storedTables = store.toMap()
			setStoredTables(new Map(_storedTables))
		})
	}, [store, setStoredTables])

	const pipeline = usePipeline(store)

	const runPipeline = useRunPipeline(
		pipeline,
		setSelectedTableName,
		onOutputTable,
	)
	const addNewTables = useAddNewTables(store)
	const { isLoading } = getLoadingOrchestrator(LoadingOrchestratorType.Tables)

	// TODO: resolve these from the stored table state
	const derived = useMemo(() => {
		const unique = new Set<string>()
		steps?.forEach(step => unique.add(step.id))
		return Array.from(unique).map(name => ({
			id: name,
		}))
	}, [steps])

	const selectedTable = useMemo((): ColumnTable | undefined => {
		return storedTables.get(selectedTableName ?? '')?.table
	}, [storedTables, selectedTableName])

	const selectedMetadata = useMemo((): TableMetadata | undefined => {
		if (selectedTableName) {
			return store.get(selectedTableName ?? '')?.metadata
		}
	}, [store, selectedTableName])

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
		if (tables.length) {
			addNewTables(tables)
			const last = tables[tables.length - 1]
			setSelectedTableName(last?.id)
		}
	}, [tables, addNewTables, setSelectedTableName])

	useEffect(() => {
		if (lastTableName && onOutputTable) {
			const table = storedTables.get(lastTableName)
			if (table) {
				onOutputTable(table)
			}
		}
	}, [storedTables, lastTableName, onOutputTable])

	useEffect(() => {
		if (steps && steps.length > 0) {
			if (
				steps?.filter(s => !pipeline.steps?.includes(s)).length ||
				steps?.length !== pipeline.steps.length
			) {
				pipeline.clear()
				steps && pipeline.addAll(steps)
				runPipeline()
			}
		}
	}, [steps, pipeline, runPipeline])

	const onSaveStep = useOnSaveStep(onUpdateSteps, steps)
	const onDeleteStep = useOnDeleteStep(onUpdateSteps, steps)

	const onUpdateMetadata = useOnUpdateMetadata(store, selectedTableName)

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
		onUpdateMetadata,
		tablesLoading: isLoading,
	}
}
