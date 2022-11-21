/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'

import { useDataTables } from '../index.js'

export function useDataTable(name: string | undefined): DataTable | undefined {
	const tables = useDataTables()
	return tables.find(t => t.name === name)
}
