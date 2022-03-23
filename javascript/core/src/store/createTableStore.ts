/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { from } from 'rxjs'
import type { TableContainer } from '../tables/types.js'
import { DefaultStore } from './DefaultStore.js'
import type { Store } from './types.js'

export function createTableStore(
	tables: TableContainer[] = [],
): Store<TableContainer> {
	const store = new DefaultStore<TableContainer>((c: TableContainer) =>
		c.table?.print(),
	)
	for (let table of tables) {
		store.set(table.id, from([table]))
	}
	return store
}
