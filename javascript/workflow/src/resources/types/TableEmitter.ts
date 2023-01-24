/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { Emitter } from './Emitter.js'
import type { Transformer } from './Transformer.js'

/**
 * An emitter for TableContainers
 */
export type TableEmitter = Emitter<TableContainer>
export type TableTransformer = Transformer<TableContainer, TableContainer>
