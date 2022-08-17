/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import type { Node } from '@datashaper/dataflow'

export type NodeFactory = (id: string) => Node<TableContainer>
