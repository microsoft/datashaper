/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { FetchArgs, Step, TableStore } from '../../index.js'

/**
 * Executes an arquero loadCSV
 * @param step
 * @param store
 * @returns
 */
export async function fetch(
	step: Step,
	_store: TableStore,
): Promise<ColumnTable> {
	const { args } = step
	const { url, delimiter } = args as FetchArgs

	const tableFromCSV: Promise<ColumnTable> = loadCSV(url, {
		delimiter: delimiter,
	})
	return tableFromCSV
}
