/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFormat, DataShape, ParserOptions } from '@datashaper/schema'
import { createDataTableSchemaObject } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { BaseFile } from '@datashaper/utilities'
import { DataTable } from '@datashaper/workflow'
import { useCallback, useContext } from 'react'

import { DataPackageContext } from '../../../context/index.js'
import { removeExtension } from '../../../util/index.js'
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
			format: DataFormat,
			parser: ParserOptions,
			shape: DataShape,
		) => {
			onAddTable(parser, file, table, format, shape)
			setFile(undefined)
		},
		[onAddTable, file, setFile],
	)
}

function useAddTable(): AddTableHandler {
	const store = useContext(DataPackageContext)
	return useCallback(
		(
			parser: ParserOptions,
			file: BaseFile,
			{ id }: TableContainer,
			format: DataFormat,
			shape: DataShape,
		) => {
			const name = removeExtension(id)
			const table = new DataTable(
				createDataTableSchemaObject({
					shape,
					parser,
					format,
				}),
			)
			table.name = name
			table.data = file
			store.addResource(table)
		},
		[store],
	)
}
