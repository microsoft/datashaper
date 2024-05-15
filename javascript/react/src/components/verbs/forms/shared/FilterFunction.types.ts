/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Criteria } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export interface FilterFunctionProps {
	table: ColumnTable
	column: string
	criteria: Criteria
	onChange?: (filter: Criteria) => void
}
