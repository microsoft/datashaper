/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadCSV, loadJSON } from 'arquero'

import type { InputStep } from '../graph/index.js'
import { inputNodeFactory } from '../graph/index.js'
import { container } from '../tables/container.js'
import type { TableContainer } from '../tables/types.js'

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
