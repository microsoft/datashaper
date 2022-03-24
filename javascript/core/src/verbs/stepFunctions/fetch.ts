/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadCSV, loadJSON } from 'arquero'

import type { FetchArgs } from '../types/index.js'
import type { InputStep } from '../util/factories.js'

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
