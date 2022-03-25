/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadCSV, loadJSON } from 'arquero'

import type { InputStep } from './nodeFactories/index.js'
import { inputNodeFactory } from './nodeFactories/InputNode.js'

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

export const fetchStep: InputStep<FetchArgs> = ({
	url,
	delimiter,
	autoMax,
}) => {
	if (url.toLowerCase().endsWith('.json')) {
		return loadJSON(url, {
			autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		})
	} else {
		return loadCSV(url, {
			delimiter,
			autoMax: autoMax !== undefined ? autoMax : 0,
			autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		})
	}
}

export const fetch = inputNodeFactory(fetchStep)
