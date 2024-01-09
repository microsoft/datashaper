/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataGraphEdges } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

export interface EdgeBindingsProps {
	definition: DataGraphEdges
	table: ColumnTable | undefined
}
