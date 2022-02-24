/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadCSV } from 'arquero'
import { container } from '../../factories.js'
import type { FetchArgs, Step, TableStore } from '../../index.js'
import type { TableContainer } from '../../types.js'

/**
 * Executes an arquero loadCSV
 * @param step
 * @param store
 * @returns
 */
export async function fetch(
	step: Step,
	_store: TableStore,
): Promise<TableContainer> {
	const { output, args } = step
	const { url, delimiter } = args as FetchArgs

	const tableFromCSV = await loadCSV(url, {
		delimiter: delimiter,
	})
	return container(output, tableFromCSV)
}
