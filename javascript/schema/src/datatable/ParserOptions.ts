/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Parsing options for delimited files. This is a mix of the options from pandas and spark.
 */
export interface ParserOptions {
	/**
	 * Column delimiter.
	 * Default: ,
	 */
	delimiter?: string
	/**
	 * List of column names to use.
	 * If this is not supplied, column names will be inferred from the first row of the data.
	 */
	names?: string[]
	/**
	 * Indicates that the first row of the file contains column header names.
	 * If false, `names` should be supplied, otherwise incrementing numbers will be assigned as header names.
	 * Default: true
	 */
	header?: boolean
	/**
	 * Character that indicates the end of a line (row).
	 * Default: \\r, \\r\\n, or \\n
	 */
	lineTerminator?: string
	/**
	 * Character to use for quoting strings.
	 * Default: "
	 */
	quoteChar?: string
	/**
	 * String to use for escaping quotes.
	 * Default: none
	 */
	escapeChar?: string
	/**
	 * Character that denotes a comment. Lines that begin with this character are ignored.
	 * Default: none.
	 */
	comment?: string
	/**
	 * Skip blank lines when reading file.
	 * Default: true.
	 */
	skipBlankLines?: boolean
	/**
	 * Number of rows to skip from the start of the data (honors skipBlankLines).
	 * Default: 0
	 */
	skipRows?: number
	/**
	 * Number of rows to read from the data, starting at skip_rows (honors skipBlankLines).
	 * Default: Infinity
	 */
	readRows?: number
}
