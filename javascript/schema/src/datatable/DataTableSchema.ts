/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFormat } from '../data.js'
import type { ResourceSchema } from '../datapackage/ResourceSchema.js'
import type { DataShape } from './DataShape.js'
import type { ParserOptions } from './ParserOptions.js'
import type { TypeHints } from './TypeHints.js'

/**
 * This defines the table-containing resource type.
 * A dataset can be embedded directly using the `data` property,
 * or it can be linked to a raw file using the `path`.
 * If the latter, optional format and parsing options can be applied to aid interpreting the file contents.
 * resource profile: 'datatable'
 */
export interface DataTableSchema extends ResourceSchema {
	profile: 'datatable'

	/**
	 * Option to embed the data directly in the JSON descriptor.
	 */
	data?: any
	/**
	 * File format of the resource to inform load/parse.
	 * Note that if the data property is present, this is assumed to be "JSON".
	 * Default: "csv".
	 */
	format?: DataFormat
	/**
	 * String encoding.
	 * Default: "utf-8".
	 */
	encoding?: string
	/**
	 * Defines the shape and structure of stored data.
	 */
	shape?: DataShape
	/**
	 * Parser options for interpreting a CSV or other text file that needs parse instruction.
	 */
	parser?: ParserOptions
	/**
	 * Options for converting string values to strict types.
	 * Note that options related to data typing only apply if type detection is turned on.
	 * Otherwise all cell values are treated as strings.
	 * Defaults based on pandas: https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#csv-text-files
	 */
	typeHints?: TypeHints
	/**
	 * Number of rows in the data.
	 */
	rows?: number
	/**
	 * Number of columns in the data.
	 */
	columns?: number
}
