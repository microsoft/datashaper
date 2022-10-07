/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FetchArgs } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { container } from '@datashaper/tables'
import { fromCSV, fromJSON } from 'arquero'

import type { InputStep } from '../dataflow/index.js'
import { inputNodeFactory } from '../dataflow/index.js'
import { fetchFile } from '../util/network.js'

export const fetchStep: InputStep<TableContainer, FetchArgs> = async (
	{ url, delimiter, autoMax },
	id,
) => {
	const dataBlob = await fetchFile(url)
	const content = await dataBlob.text()

	const table = url.toLowerCase().endsWith('.json')
		? fromJSON(content, {
				autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		  })
		: fromCSV(content, {
				delimiter,
				autoMax: autoMax !== undefined ? autoMax : 0,
				autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		  })
	return container(id, table)
}

export const fetch = inputNodeFactory(fetchStep)
