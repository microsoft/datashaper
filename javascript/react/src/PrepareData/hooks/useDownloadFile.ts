/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	Pipeline,
	TableStore,
	TableContainer,
} from '@data-wrangling-components/core'
import {
	download,
	downloadTable,
	FileCollection,
	FileMimeType,
	createFileWithPath,
	FileWithPath,
} from '@data-wrangling-components/utilities'
import { useCallback, useState } from 'react'

export function useDownloadPipeline(pipeline: Pipeline): () => void {
	return useCallback(() => {
		const steps = pipeline.steps
		if (steps.length) {
			const blob = new Blob([JSON.stringify({ steps }, null, 4)])
			download('pipeline.json', FileMimeType.json, blob)
		}
	}, [pipeline])
}

export function useDownloadCsv(
	pipeline: Pipeline,
	store: TableStore,
): () => void {
	return useCallback(async () => {
		const last = pipeline.last
		if (last) {
			const table = await store.table(pipeline.last.output)
			downloadTable(table, 'output.csv')
		}
	}, [pipeline, store])
}

export function useDownloadZip(
	pipeline: Pipeline,
	store: TableStore,
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

		const last = pipeline.last
		const tables = store.list()
		if (last) {
			const table = await store.get(pipeline.last.output)
			const file = tableFile(table, 'output')
			if (file) {
				await fileCollection.add(file)
			}
		}

		if (tables.length) {
			const tableContainerList = await Promise.all(
				tables.map(id => store.get(id)),
			)
			const files = tableContainerList
				.map(table => tableFile(table))
				.filter(f => f !== null)
			if (files.length) {
				await fileCollection.add(files as FileWithPath[])
			}
		}

		if (pipeline.steps.length) {
			const blob = new Blob([
				JSON.stringify({ steps: pipeline.steps }, null, 4),
			])
			const file = createFileWithPath(blob, { name: 'pipeline.json' })
			await fileCollection.add(file)
		}

		if (fileCollection.list().length) {
			await fileCollection.toZip('dwc-project')
		}
	}, [fileCollection, pipeline, store])
}
