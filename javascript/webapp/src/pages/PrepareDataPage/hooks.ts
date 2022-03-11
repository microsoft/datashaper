/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import { FileCollection, FileType } from '@data-wrangling-components/utilities'
import { useCallback, useEffect, useState } from 'react'

export function useBusinessLogic(): {
	setSteps: (steps: Step[]) => void
	steps: Step[]
	tables: TableContainer[]
	updateTables: (tables: TableContainer[]) => void
	outputTable: TableContainer
	setOutputTable: (table: TableContainer) => void
} {
	const [fileCollection, setFileCollection] = useState<FileCollection>(
		new FileCollection(),
	)
	const [steps, setSteps] = useState<Step[]>([])
	const [tables, setTables] = useState<TableContainer[]>([])
	const [outputTable, setOutputTable] = useState<TableContainer>()

	const updateFileCollection = useCallback(
		async (collection: FileCollection) => {
			setFileCollection(collection)
			const tablesTransformed = collection
				.list(FileType.table)
				.map(async table => {
					return {
						id: table.name,
						table: await table.toTable(),
					}
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

			updateFileCollection(fileCollection)
		}
		f()
	}, [fileCollection, updateFileCollection])

	const updateTables = useCallback(
		(tables: TableContainer[]) => {
			setTables((prev: TableContainer[]) =>
				!tables.length ? [] : [...prev, ...tables],
			)
		},
		[setTables],
	)

	return {
		setSteps,
		steps,
		tables,
		updateTables,
		outputTable,
		setOutputTable,
	}
}
