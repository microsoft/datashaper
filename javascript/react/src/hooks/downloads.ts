/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Workflow } from '@data-wrangling-components/core'
import type { FileWithPath } from '@data-wrangling-components/utilities'
import {
	createFileWithPath,
	download,
	downloadTable,
	FileCollection,
	FileMimeType,
} from '@data-wrangling-components/utilities'
import type { TableContainer } from '@essex/arquero'
import { useCallback, useState } from 'react'

export function useDownloadWorkflow(workflow: Workflow): () => void {
	return useCallback(() => {
		if (workflow != null) {
			const blob = toBlobJson(workflow.toJsonObject())
			download('worfklow.json', FileMimeType.json, blob)
		}
	}, [workflow])
}

export function useDownloadCsv(tables: TableContainer[]): () => void {
	return useCallback(() => {
		for (const table of tables) {
			if (table?.table) {
				downloadTable(table.table, tableName(table.name || table.id))
			}
		}
	}, [tables])
}

export function useDownloadZip(
	workflow: Workflow,
	tables: TableContainer[],
	outputTables: TableContainer[],
): () => Promise<void> {
	const [fileCollection] = useState<FileCollection>(new FileCollection())
	return useCallback(async () => {
		fileCollection.clear()
		const input: string[] = []
		const output: string[] = []

		for (const outputTable of outputTables) {
			if (outputTable?.table) {
				const file = tableFile(outputTable, outputTable.name || outputTable.id)
				if (file) {
					await fileCollection.add(file)
					output.push(file.name)
				}
			}
		}

		if (tables.length) {
			const files = tables
				.map(table => tableFile(table))
				.filter(f => f !== null)
			if (files.length) {
				await fileCollection.add(files as FileWithPath[])
				tables.forEach(table => {
					input.push(table.name || table.id)
				})
			}
		}

		if (input.length || output.length) {
			const blob = toBlobJson({ input, output })
			const file = createFileWithPath(blob, { name: 'metadata.json' })
			await fileCollection.add(file)
		}

		if (workflow) {
			const blob = toBlobJson(workflow.toJsonObject())
			const file = createFileWithPath(blob, { name: 'workflow.json' })
			await fileCollection.add(file)
		}

		if (fileCollection.list().length) {
			await fileCollection.toZip('dwc-project')
		}
	}, [fileCollection, workflow, tables, outputTables])
}

function toBlobJson(serializable: object): Blob {
	return new Blob([JSON.stringify(serializable, null, 4)])
}

function tableName(name: string) {
	return name.endsWith('.csv') ? name : `${name}.csv`
}

function tableFile(t: TableContainer, name?: string) {
	return t.table
		? createFileWithPath(new Blob([t.table.toCSV()]), {
				name: tableName(name || t.name || t.id),
		  })
		: null
}
