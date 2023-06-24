/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataFormat } from '../data.js'
import type { TypeHints } from './TypeHints.js'

/**
 * This is a collection of default string values for inferring strict types from strings.
 * They replicate the defaults from pandas.
 * https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#csv-text-files
 */
export const TypeHintsDefaults: Required<TypeHints> = {
	dataFormat: DataFormat.CSV,
	arrayDelimiter: ",",
	trueValues: ['true'],
	falseValues: ['false'],
	naValues: [
		'-1.#IND',
		'1.#QNAN',
		'1.#IND',
		'-1.#QNAN',
		'#N/A N/A',
		'#N/A',
		'N/A',
		'n/a',
		'NA',
		'<NA>',
		'#NA',
		'NULL',
		'null',
		'NaN',
		'-NaN',
		'nan',
		'-nan',
		'',
	],
	thousands: '',
	decimal: '.',
	infinity: ['-inf', 'inf'],
	// TODO: this is using moment.js. We need to make sure we're using a pandas-compatible parser notation.
	dateFormat: 'YYYY-MM-DD',
}
