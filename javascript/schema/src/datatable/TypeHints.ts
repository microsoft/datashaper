/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DataFormat } from "../data.js"

/**
 * Configuration values for interpreting data types when parsing a delimited file.
 * By default, all values are read as strings - applying these type hints can derive primitive types from the strings.
 */
export interface TypeHints {
	/**
	 * The data format
	 */
	dataFormat?: DataFormat
	/**
	 * The character to use for delimiting arrays.
	 */
	arrayDelimiter?: string
	/**
	 * Default: case-insenstive word "true".
	 */
	trueValues?: string[]
	/**
	 * Default: case-insenstive word "false".
	 */
	falseValues?: string[]
	/**
	 * Strings to consider NaN or null.
	 * Default:
	 * ['-1.#IND', '1.#QNAN', '1.#IND', '-1.#QNAN', '#N/A N/A', '#N/A', 'N/A', 'n/a', 'NA', '<NA>', '#NA', 'NULL', 'null', 'NaN', '-NaN', 'nan', '-nan', '']
	 */
	naValues?: string[]
	/**
	 * For large numbers that have been written with a thousands separator, you can set the thousands keyword to a string of length 1 so that integers will be parsed correctly.
	 * By default, numbers with a thousands separator will be parsed as strings.
	 * Default: none.
	 */
	thousands?: string
	/**
	 * Character to use when parsing decimal numbers.
	 * Default: .
	 */
	decimal?: string
	/**
	 * Strings to parse as negative and positive infinity.
	 * Default: case insensitive ["-inf", "inf"].
	 */
	infinity?: [string, string]
	/**
	 * Default date format to use when parsing dates. The Codebook can override this at the column level.
	 * Default: yyyy-MM-dd
	 * TODO: spark has a separate config for datetime. Do we care?
	 */
	dateFormat?: string
}
