/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableContainer } from '@datashaper/arquero'
import { container } from '@datashaper/arquero'
import type { InputStep } from '@essex/dataflow'
import { inputNodeFactory } from '@essex/dataflow'
import { loadCSV, loadJSON } from 'arquero'

export interface FetchArgs {
	/**
	 * URL where the csv file is located
	 */
	url: string
	/**
	 * Optional delimiter for csv
	 */
	delimiter?: string
	/**
	 * Optional autoMax for tables
	 */
	autoMax?: number
}

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
