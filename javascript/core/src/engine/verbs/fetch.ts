/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadCSV, loadJSON } from 'arquero'

import { container } from '../../factories.js'
import type { FetchStep, TableStore } from '../../index.js'
import type { TableContainer } from '../../types.js'

/**
 * Executes an arquero loadCSV
 */
export async function fetch(
	{ output, args: { url, delimiter, autoMax } }: FetchStep,
	_store: TableStore,
): Promise<TableContainer> {
	if (url.toLowerCase().endsWith('.json')) {
		const tableFromJSON = await loadJSON(url, {
			autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		})

		return container(output, tableFromJSON)
	} else {
		const tableFromCSV = await loadCSV(url, {
			delimiter: delimiter,
			autoMax: autoMax !== undefined ? autoMax : 0,
			autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		})

		return container(output, tableFromCSV)
	}
}
