/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import { container } from '@datashaper/arquero'
import type { InputStep } from '@datashaper/dataflow'
import { inputNodeFactory } from '@datashaper/dataflow'
import type { FetchArgs } from '@datashaper/schema'
import { loadCSV, loadJSON } from 'arquero'

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
