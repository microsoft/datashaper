/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import {
	getLoadingOrchestrator,
	OrchestratorType,
} from '@data-wrangling-components/react/src/Orchestrator'
import { FileCollection, FileType } from '@data-wrangling-components/utilities'
import { useCallback, useEffect, useState } from 'react'

export function useBusinessLogic(): {
	setSteps: (steps: Step[]) => void
	steps: Step[]
	tables: TableContainer[]
} {
	const [fileCollection, setFileCollection] = useState<FileCollection>(
		new FileCollection(),
	)

	const [steps, setSteps] = useState<Step[]>([])
	const [tables, setTables] = useState<TableContainer[]>([])
	const loading = getLoadingOrchestrator(OrchestratorType.Tables)

	const updateFileCollection = useCallback(
		async (collection: FileCollection) => {
			setFileCollection(collection)
			const tablesTransformed = collection
				.list(FileType.table)
				.map(async table => {
					return {
						id: table.name,
						table: await table.toTable(),
					} as TableContainer
				})
			const _tables = await Promise.all(tablesTransformed)
			setTables(_tables)
		},
		[setFileCollection, setTables],
	)

	useEffect(() => {
		const f = async () => {
			await Promise.all([
				fileCollection.add('data/companies.csv'),
				fileCollection.add('data/companies2.csv'),
				fileCollection.add('data/products.csv'),
				fileCollection.add('data/stocks.csv'),
			])
			await updateFileCollection(fileCollection)
			loading.stop()
		}
		loading.start()
		f()
	}, [fileCollection, updateFileCollection, loading])

	return {
		setSteps,
		steps,
		tables,
	}
}
