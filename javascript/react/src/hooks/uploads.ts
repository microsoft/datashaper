/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { WorkflowObject } from '@data-wrangling-components/core'
import { FileCollection, FileType } from '@data-wrangling-components/utilities'
import type { TableContainer } from '@essex/arquero'
import { useCallback } from 'react'

function useCsvHandler(onUpdateTables: (tables: TableContainer[]) => void) {
	return useCallback(
		async (fc: FileCollection) => {
			let tables = fc.list(FileType.table)
			if (!tables.length) {
				return
			}
			const regex = /metadata\.json$/i
			const jsonFile = fc.list(FileType.json).find(f => regex.test(f.name))
			const metadata = jsonFile ? await jsonFile.toJson() : null
			const { input = [] } = metadata || {}
			if (input.length) {
				tables = tables.filter(t => input.includes(t.name))
			}
			const tableContainer = []

			for await (const t of tables) {
				const { name } = t
				const table = {
					name,
					table: await t.toTable(),
					id: name, // TODO: validate which id is more appropriate
				} as TableContainer
				tableContainer.push(table)
			}
			onUpdateTables(tableContainer)
		},
		[onUpdateTables],
	)
}

function useJsonHandler(onUpdateWorkflow?: (workflow: WorkflowObject) => void) {
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
			const workflow = (await json.toJson()) as WorkflowObject
			if (workflow && onUpdateWorkflow) {
				onUpdateWorkflow(workflow)
			}
		},
		[onUpdateWorkflow],
	)
}

export function useHandleCsvUpload(
	onUpdateTables: (tables: TableContainer[]) => void,
): () => void {
	const csvHandler = useCsvHandler(onUpdateTables)
	return useHandleOnUploadClick(['.csv'], csvHandler)
}

export function useHandleJsonUpload(
	onUpdateWorkflow: (workflow: WorkflowObject) => void,
): () => void {
	const jsonHandler = useJsonHandler(onUpdateWorkflow)
	return useHandleOnUploadClick(['.json'], jsonHandler)
}

export function useHandleFileUpload(
	onUpdateWorkflow: (workflow: WorkflowObject) => void,
	onUpdateTables: (tables: TableContainer[]) => void,
): (fc: FileCollection) => void {
	const jsonHandler = useJsonHandler(onUpdateWorkflow)
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
	onUpdateWorkflow: (workflow: WorkflowObject) => void,
	onUpdateTables: (tables: TableContainer[]) => void,
): () => void {
	const jsonHandler = useJsonHandler(onUpdateWorkflow)
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
	return useHandleOnUploadClick(['.zip'], handler)
}

export function useHandleOnUploadClick(
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
					console.error(e)
				}
			}
		}
		input.click()
		input = null
	}, [acceptedFileTypes, handleCollection])
}
