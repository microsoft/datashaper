/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadCSV, loadJSON } from 'arquero'

import type { FetchArgs } from '../index.js'
import { makeInputNode } from './util/factories.js'

export const fetch = makeInputNode<FetchArgs>(
	({ url, delimiter, autoMax }: FetchArgs) => {
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
	},
)
