/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Node } from '../../graph/types.js'
import type { TableContainer } from '../../tables/types.js'

export type NodeFactory = (id: string) => Node<TableContainer>
