/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultPipeline } from './DefaultPipeline.js'
import { DefaultTableStore } from './DefaultTableStore.js'
import type { Pipeline, TableContainer, TableStore } from './types.js'

export function createTableStore(tables?: TableContainer[]): TableStore {
	return new DefaultTableStore(tables)
}

export function createPipeline(store: TableStore): Pipeline {
	return new DefaultPipeline(store)
}
