/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema } from '@datashaper/schema'
import { generateCodebook } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useEffect, useState } from 'react'

export function useCodebookContent(
	table?: ColumnTable,
): CodebookSchema | undefined {
	const [codebook, setCodebook] = useState<CodebookSchema | undefined>()
	useEffect(() => {
		if (table) {
			generateCodebook(table).then(setCodebook)
		}
	}, [table])
	return codebook
}
