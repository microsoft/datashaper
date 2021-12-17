/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { internal as ArqueroTypes } from 'arquero'
import { useMemo } from 'react'

export function useReifiedTable(
	table: ArqueroTypes.ColumnTable,
): ArqueroTypes.ColumnTable {
	return useMemo(() => table.reify(), [table])
}
