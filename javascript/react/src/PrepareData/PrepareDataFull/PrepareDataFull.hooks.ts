/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Step,
	TableContainer,
	TableMetadata,
	TableStore,
} from '@data-wrangling-components/core'
import type { FileCollection } from '@data-wrangling-components/utilities'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useMemo, useState } from 'react'

import { usePipeline, useStore } from '../../common/index.js'
import {
	getLoadingOrchestrator,
	LoadingOrchestratorType,
} from '../../Orchestrator/index.js'
import { useHandleFileUpload } from '../../ProjectMgmtCommandBar/index.js'
import {
	useAddNewTables,
	useMessageBar,
	useOnDeleteStep,
	useOnSaveStep,
	useOnUpdateMetadata,
	useRunPipeline,
} from '../hooks/index.js'

export function useBusinessLogic(
	tables: TableContainer[],
	onUpdateTables: (tables: TableContainer[]) => void,
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
	handleFileUpload: (fileCollection: FileCollection) => void
	Message: JSX.Element | null
	setMessage: (message: string) => void
} {
	const [selectedTableName, setSelectedTableName] = useState<string>()
	const [message, setMessage] = useState<string>()
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
	const tablesOrchestrator = getLoadingOrchestrator(
		LoadingOrchestratorType.Tables,
	)
	const handleFileUpload = useHandleFileUpload(onUpdateSteps, onUpdateTables)

	// TODO: resolve these from the stored table state
	const derived = useMemo(() => {
		const unique = new Set<string>()
		steps?.forEach(step => unique.add(step.output))
		return Array.from(unique).map(name => ({
			id: name,
		}))
	}, [steps])

	const selectedTable = useMemo((): ColumnTable | undefined => {
		return storedTables.get(selectedTableName ?? '')?.table
	}, [selectedTableName, storedTables])

	const selectedMetadata = useMemo((): TableMetadata | undefined => {
		return storedTables.get(selectedTableName ?? '')?.metadata
	}, [storedTables, selectedTableName])

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
		void runPipeline()
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

	const onSaveStep = useOnSaveStep(onUpdateSteps, pipeline)
	const onDeleteStep = useOnDeleteStep(onUpdateSteps, pipeline)
	const Message = useMessageBar(message, setMessage)

	const onUpdateMetadata = useOnUpdateMetadata(
		setStoredTables,
		store,
		selectedTableName,
	)

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
		handleFileUpload,
		Message,
		setMessage,
		tablesLoading: tablesOrchestrator.isLoading,
	}
}
