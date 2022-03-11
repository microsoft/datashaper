/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableContainer } from '@data-wrangling-components/core'
import type { FileWithPath } from '@data-wrangling-components/utilities'
import {
	createFileWithPath,
	download,
	downloadTable,
	FileCollection,
	FileMimeType,
} from '@data-wrangling-components/utilities'
import { useCallback, useState } from 'react'

export function useDownloadPipeline(steps: Step[]): () => void {
	return useCallback(() => {
		if (steps.length) {
			const blob = new Blob([JSON.stringify({ steps }, null, 4)])
			download('pipeline.json', FileMimeType.json, blob)
		}
	}, [steps])
}

export function useDownloadCsv(outputTable?: TableContainer): () => void {
	return useCallback(() => {
		if (outputTable?.table) {
			downloadTable(outputTable.table, 'output.csv')
		}
	}, [outputTable])
}

export function useDownloadZip(
	steps: Step[],
	tables: TableContainer[],
	outputTable?: TableContainer,
): () => Promise<void> {
	const [fileCollection] = useState<FileCollection>(new FileCollection())
	return useCallback(async () => {
		const tableName = (name: string) =>
			name.endsWith('.csv') ? name : `${name}.csv`
		const tableFile = (t: TableContainer, name?: string) =>
			t.table
				? createFileWithPath(new Blob([t.table.toCSV()]), {
						name: tableName(name || t.name || t.id),
				  })
				: null
		fileCollection.clear()

		if (outputTable?.table) {
			const file = tableFile(outputTable, 'output')
			if (file) {
				await fileCollection.add(file)
			}
		}

		if (tables.length) {
			const files = tables
				.map(table => tableFile(table))
				.filter(f => f !== null)
			if (files.length) {
				await fileCollection.add(files as FileWithPath[])
			}
		}

		if (steps.length) {
			const blob = new Blob([JSON.stringify({ steps: steps }, null, 4)])
			const file = createFileWithPath(blob, { name: 'pipeline.json' })
			await fileCollection.add(file)
		}

		if (fileCollection.list().length) {
			await fileCollection.toZip('dwc-project')
		}
	}, [fileCollection, steps, tables, outputTable])
}
