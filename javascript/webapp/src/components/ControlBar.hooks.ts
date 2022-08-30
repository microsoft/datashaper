/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import type { BaseFile } from '@datashaper/utilities'
import type { WorkflowObject } from '@datashaper/workflow'
import { useCallback } from 'react'

export function useLoadSpecFile(): (file: BaseFile) => Promise<WorkflowObject> {
	return useCallback((file: BaseFile): Promise<WorkflowObject> => {
		return file.toJson() as Promise<WorkflowObject>
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
