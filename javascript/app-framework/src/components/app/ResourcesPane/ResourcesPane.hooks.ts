/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, DataTableSchema } from '@datashaper/schema'
import { createDataTableSchemaObject } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { BaseFile } from '@datashaper/utilities'
import { removeExtension } from '@datashaper/utilities'
import { Codebook, DataTable, TableBundle } from '@datashaper/workflow'
import { useCallback, useContext } from 'react'

import { DataPackageContext } from '../../../context/index.js'
import type { OpenTableHandler } from '../../tables/ImportTable/ImportTable.types.js'
import type { AddTableHandler } from './ResourcesPane.types.js'

export function useOnOpenTable(
	file: BaseFile,
	setFile: (file: BaseFile | undefined) => void,
): OpenTableHandler {
	const onAddTable = useAddTable()
	return useCallback(
		(
			table: TableContainer,
			schema: DataTableSchema,
			codebook?: CodebookSchema,
		) => {
			onAddTable(file, table, schema, codebook)
			setFile(undefined)
		},
		[onAddTable, file, setFile],
	)
}

function useAddTable(): AddTableHandler {
	const store = useContext(DataPackageContext)
	return useCallback(
		(
			file: BaseFile,
			{ id }: TableContainer,
			schema: DataTableSchema,
			codebook?: CodebookSchema,
		) => {
			const name = removeExtension(id)
			const table = new DataTable(createDataTableSchemaObject(schema))
			table.data = file
			table.title = id
			table.name = id
			table.path = id

			const cb = codebook ? [new Codebook(codebook)] : []
			const tableBundle = new TableBundle()
			tableBundle.sources = [...tableBundle.sources, table, ...cb]
			tableBundle.name = name

			store.addResource(tableBundle)
		},
		[store],
	)
}

