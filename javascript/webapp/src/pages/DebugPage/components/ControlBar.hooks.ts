/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { BaseFile } from '@datashaper/utilities'
import { useCallback } from 'react'

export function useLoadSpecFile(): (file: BaseFile) => Promise<Workflow> {
	return useCallback((file: BaseFile): Promise<Workflow> => {
		return file.toJson() as Promise<Workflow>
	}, [])
}

export function useLoadTableFiles(): (
	files: BaseFile[],
) => Promise<TableContainer[]> {
	return useCallback(
		(files: BaseFile[]): Promise<TableContainer[]> =>
			Promise.all(files.map(readTable)),
		[],
	)
}

async function readTable(file: BaseFile): Promise<TableContainer> {
	const table = await file.toTable()
	return { id: file.name, table }
}
