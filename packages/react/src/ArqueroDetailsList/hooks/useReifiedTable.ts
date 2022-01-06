/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useReifiedTable(table: ColumnTable): ColumnTable {
	return useMemo(() => table.reify(), [table])
}
