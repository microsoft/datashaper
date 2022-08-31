/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * This is a collection of default string values for inferring strict types from strings.
 * They replicate the defaults from pandas.
 * https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#csv-text-files
 */
export const NA_DEFAULTS = [
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
]

export const TRUE_DEFAULTS = ['true']

export const FALSE_DEFAULTS = ['false']

export const DECIMAL_DEFAULT = '.'

export const THOUSANDS_DEFAULT = ','

export const COMMENT_DEFAULT = '#'

export const DELIMITER_DEFAULT = ','

export const DATE_FORMAT_DEFAULT = 'YYYY-MM-DD'
