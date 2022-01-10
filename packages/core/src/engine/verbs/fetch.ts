/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadCSV } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'

/**
 * Executes an arquero impute
 * @param step
 * @param store
 * @returns
 */
export async function fetch(
	url: string,
	delimiter: string,
): Promise<ColumnTable> {
	const tableFromCSV: Promise<ColumnTable> = loadCSV(url, {
		delimiter: delimiter,
	})
	return tableFromCSV
}
