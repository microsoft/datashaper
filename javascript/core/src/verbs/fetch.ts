/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import { container } from '@datashaper/arquero'
import type { FetchArgs } from '@datashaper/schema'
import { loadCSV, loadJSON } from 'arquero'

import type { InputStep } from '../dataflow/index.js'
import { inputNodeFactory } from '../dataflow/index.js'

export const fetchStep: InputStep<TableContainer, FetchArgs> = async (
	{ url, delimiter, autoMax },
	id,
) => {
	const table = url.toLowerCase().endsWith('.json')
		? loadJSON(url, {
				autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		  })
		: loadCSV(url, {
				delimiter,
				autoMax: autoMax !== undefined ? autoMax : 0,
				autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		  })
	return container(id, await table)
}

export const fetch = inputNodeFactory(fetchStep)
