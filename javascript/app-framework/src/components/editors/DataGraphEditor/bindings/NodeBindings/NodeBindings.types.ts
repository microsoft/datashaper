/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CartesianPointBindings } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

export interface NodeBindingsProps {
	bindings: CartesianPointBindings
	table: ColumnTable | undefined
}
