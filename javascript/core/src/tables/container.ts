/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { TableContainer } from './types.js'

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
