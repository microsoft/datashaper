/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Specification } from '@data-wrangling-components/core'
import type { FileCollection } from '@data-wrangling-components/utilities'
import { FileType } from '@data-wrangling-components/utilities'
import type { TableContainer } from '@essex/arquero'
import { useCallback } from 'react'

import { useHandleOnUploadClick } from '../../files/index.js'

function useCsvHandler(onUpdateTables: (tables: TableContainer[]) => void) {
	return useCallback(
		async (fc: FileCollection) => {
			console.log('FILEN', fc.list())
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

function useJsonHandler(onUpdateWorkflow?: (steps: Specification) => void) {
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
			const workflow = (await json.toJson()) as Specification
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
	onUpdateWorkflow: (steps: Specification) => void,
): () => void {
	const jsonHandler = useJsonHandler(onUpdateWorkflow)
	return useHandleOnUploadClick(['.json'], jsonHandler)
}

export function useHandleFileUpload(
	onUpdateWorkflow: (steps: Specification) => void,
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
	onUpdateWorkflow: (steps: Specification) => void,
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
