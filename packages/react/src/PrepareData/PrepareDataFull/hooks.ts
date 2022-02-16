/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Step,
	TableStore,
	introspect,
	TableMetadata,
} from '@data-wrangling-components/core'
import type { BaseFile } from '@data-wrangling-components/utilities'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { last } from 'lodash'
import { useState, useMemo, useEffect } from 'react'
import { usePipeline, useStore } from '../../common/index.js'
import {
	useOnDeleteStep,
	useOnSaveStep,
	useRunPipeline,
	useAddNewTables,
} from '../hooks'

export function useBusinessLogic(
	files: BaseFile[],
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
	output?: ColumnTable
	selectedTableName?: string
} {
	const [selectedTableName, setSelectedTableName] = useState<string>()
	const [storedTables, setStoredTables] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	const store = useStore()
	const pipeline = usePipeline(store)
	const runPipeline = useRunPipeline(pipeline, setStoredTables)
	const addNewTables = useAddNewTables(store, setStoredTables)

	const selectedTable = useMemo((): ColumnTable | undefined => {
		return storedTables.get(selectedTableName ?? '')
	}, [selectedTableName, storedTables])

	const selectedMetadata = useMemo((): TableMetadata | undefined => {
		return selectedTable && introspect(selectedTable, true)
	}, [selectedTable])

	const output = useMemo((): ColumnTable | undefined => {
		const name = pipeline?.last?.output
		return storedTables.get(name)
	}, [pipeline, storedTables])

	const lastTableName = useMemo((): string => {
		const _tables = store.list()
		const length = _tables.length
		const input = length === 0 ? '' : _tables[length - 1] ?? ''

		return last(steps)?.output ?? input
	}, [steps, store])

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
		if (files.length) {
			addNewTables(files)
		}
	}, [files, addNewTables])

	const onSaveStep = useOnSaveStep(onUpdateSteps, pipeline)
	const onDeleteStep = useOnDeleteStep(onUpdateSteps, pipeline)

	return {
		selectedTable,
		setSelectedTableName,
		onDeleteStep,
		onSaveStep,
		store,
		output,
		selectedMetadata,
		lastTableName,
		selectedTableName,
	}
}
