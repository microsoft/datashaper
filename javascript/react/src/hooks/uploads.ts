/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { WorkflowSchema } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { FileCollection, FileType } from '@datashaper/utilities'
import debug from 'debug'
import { useCallback } from 'react'

import { EMPTY_OBJECT } from '../empty.js'

const log = debug('datashaper')

function useCsvHandler(onUpdateTables: (tables: TableContainer[]) => void) {
	return useCallback(
		async (fc: FileCollection) => {
			let tableFiles = fc.list(FileType.table)
			if (!tableFiles.length) {
				return
			}
			const regex = /metadata\.json$/i
			const jsonFile = fc.list(FileType.json).find(f => regex.test(f.name))
			const metadata = jsonFile ? await jsonFile.toJson() : null
			const { input = [] } = metadata || EMPTY_OBJECT
			if (input.length) {
				tableFiles = tableFiles.filter(t => input.includes(t.name))
			}
			const tableContainer = []

			for await (const t of tableFiles) {
				const { name } = t
				const table = {
					table: await t.toTable(),
					id: name,
				} as TableContainer
				tableContainer.push(table)
			}
			onUpdateTables(tableContainer)
		},
		[onUpdateTables],
	)
}

function useJsonHandler(
	onUpdateWorkflow?: (workflow: WorkflowSchema) => void,
	onErrorHandler?: (error: string) => void,
) {
	return useCallback(
		async (fc: FileCollection) => {
			const regex = /workflow(.*)\.json$/i
			const files = fc.list(FileType.json)
			if (!files.length) {
				return
			}
			const json =
				files.length > 1 ? files.find(f => regex.test(f.name)) : files[0]
			if (!json) {
				return
			}
			const workflow = (await json.toJson()) as WorkflowSchema
			if (workflow && onUpdateWorkflow) {
				try {
					onUpdateWorkflow(workflow)
				} catch {
					onErrorHandler?.('Invalid workflow definition**')
				}
			}
		},
		[onUpdateWorkflow, onErrorHandler],
	)
}

export function useHandleCsvUpload(
	onUpdateTables: (tables: TableContainer[]) => void,
): () => void {
	const csvHandler = useCsvHandler(onUpdateTables)
	return useHandleFilesUpload(['.csv'], csvHandler)
}

export function useHandleJsonUpload(
	onUpdateWorkflow: (workflow: WorkflowSchema) => void,
	onErrorHandler?: (error: string) => void,
): () => void {
	const jsonHandler = useJsonHandler(onUpdateWorkflow, onErrorHandler)
	return useHandleFilesUpload(['.json'], jsonHandler)
}

export function useHandleFileUpload(
	onUpdateWorkflow: (workflow: WorkflowSchema) => void,
	onUpdateTables: (tables: TableContainer[]) => void,
	onErrorHandler?: (error: string) => void,
): (fc: FileCollection) => void {
	const jsonHandler = useJsonHandler(onUpdateWorkflow, onErrorHandler)
	const csvHandler = useCsvHandler(onUpdateTables)
	return useCallback(
		async (fc: FileCollection) => {
			/* eslint-disable @essex/adjacent-await */
			await csvHandler(fc)
			await jsonHandler(fc)
		},
		[csvHandler, jsonHandler],
	)
}

export function useHandleZipUpload(
	onUpdateWorkflow: (workflow: WorkflowSchema) => void,
	onUpdateTables: (tables: TableContainer[]) => void,
	onErrorHandler?: (error: string) => void,
): () => void {
	const jsonHandler = useJsonHandler(onUpdateWorkflow, onErrorHandler)
	const csvHandler = useCsvHandler(onUpdateTables)
	const handler = useCallback(
		async (fc: FileCollection) => {
			onUpdateTables([])
			/* eslint-disable @essex/adjacent-await */
			await csvHandler(fc)
			await jsonHandler(fc)
		},
		[csvHandler, jsonHandler, onUpdateTables],
	)
	return useHandleFilesUpload(['.zip'], handler)
}

export function useHandleFilesUpload(
	acceptedFileTypes: string[],
	handleCollection?: (fileCollection: FileCollection) => void,
): () => void {
	return useCallback(() => {
		let input: HTMLInputElement | null = document.createElement('input')
		input.type = 'file'
		input.multiple = true
		input.accept = acceptedFileTypes.toString()
		input.onchange = async (e: any) => {
			if (e?.target?.files?.length) {
				const { files } = e.target
				const fileCollection = new FileCollection()
				try {
					for (const file of files) {
						await fileCollection.add(file)
					}
					handleCollection?.(fileCollection)
				} catch (e) {
					log('error in useHandleFilesUpload', e)
				}
			}
		}
		input.click()
		input = null
	}, [acceptedFileTypes, handleCollection])
}
