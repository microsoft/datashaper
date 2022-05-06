/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'

export function createTableStore(
	tables: TableContainer[] = [],
): Map<string, TableContainer> {
	const result = new Map()
	for (const table of tables) {
		result.set(table.id, table)
	}
	return result
}
