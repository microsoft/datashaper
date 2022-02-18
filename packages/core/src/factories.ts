/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultTableStore } from './DefaultTableStore.js'
import type { TableContainer, TableStore } from './types.js'

export function createTableStore(tables?: TableContainer[]): TableStore {
	return new DefaultTableStore(tables)
}
