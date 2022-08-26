/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Codebook } from '../codebook/Codebook.js'
import type { DataFormat } from '../data.js'
import type { Resource } from '../datapackage/Resource.js'
import type { DataShape } from './DataShape.js'
import type { ParserOptions } from './ParserOptions.js'
import type { TypeHints } from './TypeHints.js'

/**
 * This defines the data-containing resource type.
 */
export interface Dataset extends Resource {
	profile: 'dataset'
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
	 * Table schema and codebook for interpreting a data table.
	 * Defaults are inferred from the data - e.g., detected column names are used.
	 * If a table schema is provided and types are specified for the columns, these are used in place of any other detected types.
	 * A schema can also be supplied via the `sources` linking property of a shared parent resource.
	 * Precedence: detected -> parent linked -> embedded
	 */
	codebook?: Codebook
	/**
	 * Number of rows in the data.
	 */
	rows?: number
	/**
	 * Number of columns in the data.
	 */
	columns?: number
}
