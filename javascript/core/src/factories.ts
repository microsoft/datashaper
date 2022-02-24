/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { DefaultPipeline } from './DefaultPipeline.js'
import { DefaultTableStore } from './DefaultTableStore.js'
import type { Pipeline, TableContainer, TableStore } from './types.js'

export function createTableStore(tables?: TableContainer[]): TableStore {
	return new DefaultTableStore(tables)
}

export function createPipeline(store: TableStore): Pipeline {
	return new DefaultPipeline(store)
}

export function container(
	id: string,
	table?: ColumnTable,
	options: Omit<TableContainer, 'id' | 'table'> = {},
): TableContainer {
	return {
		id,
		table,
		name: options.name || id,
	}
}
