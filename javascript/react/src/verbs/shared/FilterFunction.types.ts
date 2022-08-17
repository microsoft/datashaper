/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Criterion } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export interface FilterFunctionProps {
	table: ColumnTable
	column: string
	criterion: Criterion
	onChange?: (filter?: Criterion) => void
	suppressLabels?: boolean
}
