/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { TableContainer, TableMetadata } from './types.js'

export function container(
	id: string,
	table?: ColumnTable,
	metadata?: TableMetadata,
): TableContainer {
	return {
		id,
		table,
		metadata,
	}
}
