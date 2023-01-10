/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema } from '@datashaper/schema'
import { generateCodebook } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useMemo } from 'react'

export function useCodebookContent(
	table?: ColumnTable,
): CodebookSchema | undefined {
	return useMemo(() => {
		return table && generateCodebook(table)
	}, [table])
}
