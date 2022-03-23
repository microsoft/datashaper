/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '../tables/types.js'
import { DefaultStore } from './DefaultStore.js'
import type { Store } from './types.js'

export function createTableStore(): Store<TableContainer> {
	return new DefaultStore<TableContainer>((c: TableContainer) =>
		c.table?.print(),
	)
}
