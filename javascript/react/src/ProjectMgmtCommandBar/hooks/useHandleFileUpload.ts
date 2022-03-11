/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableContainer } from '@data-wrangling-components/core'
import type { FileCollection } from '@data-wrangling-components/utilities'
import { FileType } from '@data-wrangling-components/utilities'
import { useCallback } from 'react'

import { useHandleOnUploadClick } from '../../files/index.js'

function useCsvHandler(onUpdateTables?: (tables: TableContainer[]) => void) {
	return useCallback(
		async (fc: FileCollection) => {
			const tables = fc.list(FileType.table)
			if (!tables.length) {
				return
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
			onUpdateTables && onUpdateTables(tableContainer)
		},
		[onUpdateTables],
	)
}

function useJsonHandler(onUpdateSteps?: (steps: Step[]) => void) {
	return useCallback(
		async (fc: FileCollection) => {
			const regex = /pipeline(.*)\.json$/i
			const files = fc.list(FileType.json)
			if (!files.length) {
				return
			}
			const json =
				files.length > 1 ? files.find(f => regex.test(f.name)) : files[0]
			if (!json) {
				return
			}

			const { steps = [] } = await json.toJson()
			if (steps.length && onUpdateSteps) {
				onUpdateSteps(steps)
			}
		},
		[onUpdateSteps],
	)
}

export function useHandleCsvUpload(
	onUpdateTables?: (tables: TableContainer[]) => void,
): () => void {
	const csvHandler = useCsvHandler(onUpdateTables)
	return useHandleOnUploadClick(['.csv'], csvHandler)
}

export function useHandleJsonUpload(
	onUpdateSteps?: (steps: Step[]) => void,
): () => void {
	const jsonHandler = useJsonHandler(onUpdateSteps)
	return useHandleOnUploadClick(['.json'], jsonHandler)
}

export function useHandleFileUpload(
	onUpdateSteps?: (steps: Step[]) => void,
	onUpdateTables?: (tables: TableContainer[]) => void,
): (fc: FileCollection) => void {
	const jsonHandler = useJsonHandler(onUpdateSteps)
	const csvHandler = useCsvHandler(onUpdateTables)
	return useCallback(
		(fc: FileCollection) => {
			csvHandler(fc)
			jsonHandler(fc)
		},
		[csvHandler, jsonHandler],
	)
}

export function useHandleZipUpload(
	onUpdateSteps?: (steps: Step[]) => void,
	onUpdateTables?: (tables: TableContainer[]) => void,
): () => void {
	const jsonHandler = useJsonHandler(onUpdateSteps)
	const csvHandler = useCsvHandler(onUpdateTables)
	const handler = useCallback(
		(fc: FileCollection) => {
			onUpdateTables && onUpdateTables([])
			csvHandler(fc)
			jsonHandler(fc)
		},
		[csvHandler, jsonHandler, onUpdateTables],
	)
	return useHandleOnUploadClick(['.zip'], handler)
}
