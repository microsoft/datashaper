/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import { from } from 'rxjs'

import { DefaultStore } from './DefaultStore.js'
import type { Store } from './types.js'

export function createTableStore(
	tables: TableContainer[] = [],
): Store<TableContainer> {
	const store = new DefaultStore<TableContainer>((c: TableContainer) =>
		c.table?.print(),
	)
	for (const table of tables) {
		store.set(table.id, from([table]))
	}
	return store
}
