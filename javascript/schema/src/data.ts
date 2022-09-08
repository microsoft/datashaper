/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * A cell/property value of any type.
 */
export type Value = any

/**
 * Explicit data type of the value (i.e., for a column or property).
 * TODO: clarify/update null/undefined
 */
export enum DataType {
	Array = 'array',
	Boolean = 'boolean',
	Date = 'date',
	Time = 'time',
	Datetime = 'datetime',
	Number = 'number',
	Integer = 'integer',
	String = 'string',
	Object = 'object',
	Null = 'null',
	Undefined = 'undefined',
	Unknown = 'unknown',
}

/**
 * Describes the semantic shape of a variable.
 * This has particular effect on how we display and compare data,
 * such as using line charts for continuous versus bar charts for categorical.
 * This mostly applies to numeric variables, but strings for instance can be categorial.
 */
export enum VariableNature {
	/**
	 * Discrete intervals, i.e., whole numbers.
	 */
	Discrete = 'discrete',
	/**
	 * Continuously variable, i.e., decimal.
	 */
	Continuous = 'continuous',
	/**
     * Integers map to ordered categories.
     * The order matters here because it can be used to indicate progression.
     * For example:
        
		Income
        0: Unknown/missing
        1: No income
        2: 1-9999
        3: 10000-19999
        4: 20000-29999
        ...

     * In this case the integer category carries an indication of escalating income range.
     */
	Ordinal = 'ordinal',
	/**
     * Integers mapped to arbitrary categories wher order does not matter.
     * For example:
	
		Eye color
        0: Unknown/missing
        1: Green
        2: Blue
        3: Brown
        4: Hazel
        ...

     */
	Nominal = 'nominal',
	/**
	 * Only two valid values are allowed, commonly 1 = true, 0 = false.
	 */
	Binary = 'binary',
	Excluded = 'excluded',
}

/**
 * Base format the data is stored within.
 * This will expand to include additional formats such as Arrow and Parquet over time.
 * TODO: we've seen a number of examples in the wild using JSON Lines https://jsonlines.org/
 */
export enum DataFormat {
	/**
	 * Any delimited row format.
	 */
	CSV = 'csv',
	/**
	 * Valid serialized JSON string.
	 */
	JSON = 'json',
}

/**
 * Indicates the orientation of the data within the file.
 * 
 * Most CSV data files are 'values' (row-oriented).
 * 
 * JSON files can commonly be either.
 * Records are probably more common, though require more space due to replication of keys.
 * Apache Arrow or Parquet are columnar.
 * This nearly aligns with pandas:
 * https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#json
 * 
 * A key difference (which probably needs resolved) is that we don't yet support the notion of an index.
 * See their example for "columns" or "index" orientation, which is a nested structure.
 * 
 * Example JSON formats:
    values: [
        ["colA", "colB"],
        ["valueA1", "valueA2"],
        ["valueA2", "valueB2"]
    ]
    records:
        [{
            colA: valueA1,
            colB: valueB1
        }, {
            colA: valueA2,
            colB: valueB2
        }]
    columnar: 
        {
            colA: [valueA1, valueA2],
            colB: [valueB1, valueB2]
        }
 */
export enum DataOrientation {
	/**
	 * Data is stored in a flat array.
	 * If a matrix definition is provided,
	 * this can be transposed into columns/rows,
	 * otherwise it is assumed to be a single column of data.length rows.
	 */
	Array = 'array',
	/**
	 * Data is stored as raw rows. This is the default for CSVs.
	 * If specified for JSON files, it is exspected that file contents
	 * are a nested array - the outer array is the rows, and each row has an array of
	 * column values. The first row is assumed to be the column headers.
	 */
	Values = 'values',
	/**
	 * Data is oriented as an array of object records, akin to most databases.
	 * Column headers run along the horizontal axis, and cell values run down the vertical.
	 */
	Records = 'records',
	/**
	 * Data is oriented in a columnar manner, such as that used by Apache Arrow or Parquet.
	 * Column headers run down the vertical axis, and cell values run across the horizontal.
	 */
	Columnar = 'columnar',
}

/**
 * Indicates the expected general layout of the data.
 * This could be used to provide validation hints.
 * For example, microdata must have one row per subject.
 * TODO: "timeseries" as distinct from "panel"? others?
 */
export enum DataNature {
	/**
	 * Each row refers to a single subject.
	 * An example is a database of records about a person (name, address, etc.)
	 */
	Micro = 'micro',
	/**
	 * Rows refer to measurements over time of a group.
	 * An example is aggregate yearly smoking data for each US state.
	 */
	Panel = 'panel',
}

export interface ColumnNature {
	mostLikelyNature: VariableNature
	possibleNatures: VariableNature[]
	hasMissingData?: boolean
	isInteger?: boolean
	isNumber?: boolean
	isString?: boolean
	uniqueValues?: boolean[] | string[] | number[]
	uniquePresentValues?: boolean[] | string[] | number[]
}
