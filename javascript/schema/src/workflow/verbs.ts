/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema } from '../codebook/CodebookSchema.js'
import type { DataType, Value } from '../data.js'
import type { SortDirection } from '../enums/index.js'

export enum Verb {
	Aggregate = 'aggregate',
	Bin = 'bin',
	Binarize = 'binarize',
	Boolean = 'boolean',
	Concat = 'concat',
	Convert = 'convert',
	Dedupe = 'dedupe',
	Derive = 'derive',
	Difference = 'difference',
	Decode = 'decode',
	Encode = 'encode',
	Erase = 'erase',
	Fill = 'fill',
	Filter = 'filter',
	Fold = 'fold',
	Groupby = 'groupby',
	Impute = 'impute',
	Intersect = 'intersect',
	Join = 'join',
	Lookup = 'lookup',
	Merge = 'merge',
	Onehot = 'onehot',
	Orderby = 'orderby',
	Pivot = 'pivot',
	Recode = 'recode',
	Rename = 'rename',
	Rollup = 'rollup',
	Sample = 'sample',
	Select = 'select',
	Spread = 'spread',
	Unfold = 'unfold',
	Ungroup = 'ungroup',
	Unhot = 'unhot',
	Union = 'union',
	Unorder = 'unorder',
	Unroll = 'unroll',
	Window = 'window',
}

export interface InputColumnArgs {
	/**
	 * Name of the input column for columnar operations
	 */
	column: string
	/**
	 * Expected data ttpe for values in the column
	 */
	dataType?: DataType
}

/**
 * Base interface for a number of operations that work on a column list.
 */
export interface InputColumnListArgs {
	/**
	 * List of input columns for operations that work across multiple columns
	 */
	columns: string[]
}

export interface InputColumnRecordArgs {
	/**
	 * Map of old column to new column names
	 */
	columns: Record<string, string>
}

export interface InputKeyValueArgs {
	/**
	 * Key column for the operation
	 */
	key: string
	/**
	 * Value column for the operation
	 */
	value: string
}

export interface OutputColumnArgs {
	/**
	 * Name of the output column to receive the operation's result.
	 */
	to: string
}

export interface Criterion {
	/**
	 * Comparison value for the column.
	 * Not required if the operator is self-defining (e.g., 'is empty')
	 */
	value?: Value
	/**
	 * Indicates whether the filter should be directly against a value,
	 * or against the value of another column
	 */
	type: FilterCompareType
	/**
	 * Filter operator to execute. Note the correct operator for the column data type must be used.
	 */
	operator:
		| NumericComparisonOperator
		| StringComparisonOperator
		| BooleanComparisonOperator
		| DateComparisonOperator
}

/**
 * This is a subset of data types available for parsing operations.
 */
export enum ParseType {
	/**
	 * Type is a binary boolean (true/false)
	 */
	Boolean = 'boolean',
	/**
	 * Type is a date
	 */
	Date = 'date',
	/**
	 * Type is an integer (whole number)
	 */
	Integer = 'int',
	/**
	 * Type is a decimal (floating point number).
	 * Note that in JavaScript integers and decimals are both represented as "number",
	 * but the distinction is helpful for formatting/display and understanding user intent.
	 */
	Decimal = 'float',
	/**
	 * Type is a string of text.
	 */
	String = 'string',
	/**
	 * Type is an array of values.
	 */
	Array = 'array',
}

export enum MathOperator {
	Add = '+',
	Subtract = '-',
	Multiply = '*',
	Divide = '/',
}

export enum NumericComparisonOperator {
	Equals = '=',
	NotEqual = '!=',
	LessThan = '<',
	LessThanOrEqual = '<=',
	GreaterThan = '>',
	GreaterThanOrEqual = '>=',
	IsEmpty = 'is empty',
	IsNotEmpty = 'is not empty',
}

export enum DateComparisonOperator {
	Equals = 'equals',
	NotEqual = 'is not equal',
	Before = 'before',
	After = 'after',
	IsEmpty = 'is empty',
	IsNotEmpty = 'is not empty',
}

export enum StringComparisonOperator {
	Equals = 'equals',
	NotEqual = 'is not equal',
	Contains = 'contains',
	StartsWith = 'starts with',
	EndsWith = 'ends with',
	IsEmpty = 'is empty',
	IsNotEmpty = 'is not empty',
	RegularExpression = 'regex',
}

export enum BooleanComparisonOperator {
	Equals = 'equals',
	NotEqual = 'is not equal',
	IsTrue = 'is true',
	IsFalse = 'is false',
	IsEmpty = 'is empty',
	IsNotEmpty = 'is not empty',
}

export enum BooleanOperator {
	/**
	 * Any match sets the result to true
	 */
	OR = 'or',
	/**
	 * All conditions must match for the result to be true
	 */
	AND = 'and',
	/**
	 * None of the conditions can match for the result to be true
	 */
	NOR = 'nor',
	/**
	 * Any number of conditions can match but not all of them for the result to be true
	 */
	NAND = 'nand',
	/**
	 * Every pairwise comparison must contain one true and one false value
	 */
	XOR = 'xor',
	/**
	 * Every pairwise comparison must be two `true` or two `false` to be true
	 */
	XNOR = 'xnor',
}

/**
 * Indicates the type of set operation to perform across two collections.
 */
export enum SetOp {
	/**
	 * Concatenate the two collections together
	 */
	Concat = 'concat',
	/**
	 * Return the union of the two collections
	 */
	Union = 'union',
	/**
	 * Return the intersection of the two collections
	 */
	Intersect = 'intersect',
	/**
	 * Return the difference of the two collections
	 */
	Difference = 'difference',
}

/**
 * Indicates the comparison type used for a filter operation.
 * This is done on a row-by-row basis.
 */
export enum FilterCompareType {
	/**
	 * The comparison value is a literal value
	 */
	Value = 'value',
	/**
	 * The comparison value is the value from the same row in another column
	 */
	Column = 'column',
}

/**
 * This is the subset of aggregate functions that can operate
 * on a single field so we don't accommodate additional args.
 * See https://uwdata.github.io/arquero/api/op#aggregate-functions
 */
export enum FieldAggregateOperation {
	/**
	 * Select any value. Implementation-dependent - this could be random, the first found, etc.
	 */
	Any = 'any',
	/**
	 * Count the number of values
	 */
	Count = 'count',
	/**
	 * Count the number of unique values
	 */
	CountDistinct = 'distinct',
	/**
	 * Count only the valid (non-null, non-error) values
	 */
	Valid = 'valid',
	/**
	 * Count only the valid values
	 */
	Invalid = 'invalid',
	/**
	 * Find the max value
	 */
	Max = 'max',
	/**
	 * Find the min value
	 */
	Min = 'min',
	/**
	 * Sum the values
	 */
	Sum = 'sum',
	/**
	 * Compute the product of the values
	 */
	Product = 'product',
	/**
	 * Compute the mean of the values
	 */
	Mean = 'mean',
	/**
	 * Compute the mode of the values
	 */
	Mode = 'mode',
	/**
	 * Compute the median of the values
	 */
	Median = 'median',
	/**
	 * Compute the standard deviation of the values
	 */
	StandardDeviation = 'stdev',
	/**
	 * Compute the population standard deviation of the values
	 */
	StandardDeviationPopulation = 'stdevp',
	/**
	 * Compute the variance of the values
	 */
	Variance = 'variance',
	/**
	 * Collect all of the values into an array
	 */
	CreateArray = 'array_agg',
	/**
	 * Collect all of the unique values into an array
	 */
	CreateArrayDistinct = 'array_agg_distinct',
}

/**
 * These are operations that perform windowed compute.
 * See https://uwdata.github.io/arquero/api/op#window-functions
 */
export enum WindowFunction {
	RowNumber = 'row_number',
	Rank = 'rank',
	PercentRank = 'percent_rank',
	CumulativeDistribution = 'cume_dist',
	FirstValue = 'first_value',
	LastValue = 'last_value',
	FillDown = 'fill_down',
	FillUp = 'fill_up',
}

export interface AggregateArgs extends RollupArgs {
	/**
	 * Column to group by
	 */
	groupby: string
}

/**
 * Describes the binning technique to use.
 * See numpy for detailed definitions: https://numpy.org/doc/stable/reference/generated/numpy.histogram_bin_edges.html
 */
export enum BinStrategy {
	Auto = 'auto',
	Fd = 'fd',
	Doane = 'doane',
	Scott = 'scott',
	Rice = 'rice',
	Sturges = 'sturges',
	Sqrt = 'sqrt',
	FixedCount = 'fixed count',
	FixedWidth = 'fixed width',
}

export interface BinArgs extends InputColumnArgs, OutputColumnArgs {
	/**
	 * Binning techinique to use.
	 */
	strategy: BinStrategy
	/**
	 * Indicates whether bins should be rounded in a readable human-friendly way.
	 */
	nice?: boolean
	/**
	 * Fixed number of bins.
	 * Note that the bin placements are inclusive of the bottom boundary and exclusive of the top boundary -
	 * this means there is always one extra bin for the max value when using fixed count.
	 */
	fixedcount?: number
	/**
	 * Exact step size between bins
	 */
	fixedwidth?: number
	/**
	 * Min boundary to categorize values into.
	 * If cell values are below this, they will default to -Infinity unless clamped.
	 */
	min?: number
	/**
	 * Max boundary to categorize values into.
	 * If cell values are above this, they will default to +Infinity unless clamped.
	 */
	max?: number
	/**
	 * If true, values outside of the min/max boundaries will be clamped to those
	 * boundaries rather than +/-Infinity.
	 */
	clamped?: boolean
	/**
	 * If true, the range for each bin will be printed as the cell value instead of the truncated numeric value.
	 */
	printRange?: boolean
}

export interface BinarizeArgs extends FilterArgs, OutputColumnArgs {}

export interface BooleanArgs extends InputColumnListArgs, OutputColumnArgs {
	/**
	 * Boolean comparison type to apply across the list of input column values
	 */
	operator: BooleanOperator
}

export interface ConvertArgs extends InputColumnArgs, OutputColumnArgs {
	/**
	 * Output type to convert the column values to.
	 */
	type: ParseType
	/**
	 * Radix to use for parsing strings into ints
	 */
	radix?: number
	/**
	 * Delimiter to use for identifying decimals when converting strings to numbers.
	 */
	delimiter?: string
	/**
	 * Format string to use when converting strings to dates. Follows strptime format.
	 */
	formatPattern?: string
}

export type DedupeArgs = Partial<InputColumnListArgs>

export interface DeriveArgs extends OutputColumnArgs {
	/**
	 * Column on the left side of the operation
	 */
	column1: string
	/**
	 * Column on the right side of the operation
	 */
	column2: string
	/**
	 * Math opertion to perform row-by-row on the two columns
	 */
	operator: MathOperator
}

export interface EraseArgs extends InputColumnArgs {
	/**
	 * Value to match and erase (set to undefined) in the column
	 */
	value: Value
}

export interface EncodeDecodeArgs {
	/**
	 * Strategy for applying the codebook to the table.
	 */
	strategy: CodebookStrategy
	/**
	 * Codebook to apply to the table.
	 */
	codebook: CodebookSchema
}

export interface FillArgs extends OutputColumnArgs {
	/**
	 * Value to fill in the new column. All rows will receive this value.
	 */
	value: Value
}

export interface FilterArgs extends InputColumnArgs {
	/**
	 * Filter criteria to apply to the column.
	 */
	criteria: Criterion[]
	/**
	 * Boolean operator to apply to the criteria if more than one.
	 */
	logical?: BooleanOperator
}

export interface FoldArgs extends InputColumnListArgs {
	/**
	 * Two-element array of names for the output [key, value]
	 */
	to?: [string, string]
}

export type GroupbyArgs = InputColumnListArgs

export interface ImputeArgs extends InputColumnArgs {
	/**
	 * Value to fill in empty cells
	 */
	value: Value
}

export interface JoinArgsBase {
	/**
	 * Column names to join with.
	 * If only one is specified, it will use for both tables.
	 * If none are specified, all matching column names will be used.
	 */
	on?: string[]
}

export interface JoinArgs extends JoinArgsBase {
	/**
	 * Type of join to perform
	 */
	strategy?: JoinStrategy
}

export enum JoinStrategy {
	Inner = 'inner',
	LeftOuter = 'left outer',
	RightOuter = 'right outer',
	FullOuter = 'full outer',
	Cross = 'cross',
	SemiJoin = 'semi join',
	AntiJoin = 'anti join',
}

export enum CodebookStrategy {
	/**
	 * Only parse data types for each column, per the codebook definition
	 */
	DataTypeOnly = 'data type only',
	/**
	 * Only apply mappings for each column, per the codebook definition
	 */
	MappingOnly = 'mapping only',
	/**
	 * Apply both data type and mapping for each column, per the codebook definition
	 */
	DataTypeAndMapping = 'data type and mapping',
}

export interface LookupArgs extends JoinArgsBase, InputColumnListArgs {}

export enum MergeStrategy {
	/**
	 * Use the first valid value found in the list
	 */
	FirstOneWins = 'first one wins',
	/**
	 * Use the last valid value found in the list
	 */
	LastOneWins = 'last one wins',
	/**
	 * Concat all values into a string
	 */
	Concat = 'concat',
	/**
	 * Concat all values into an array
	 */
	CreateArray = 'array',
}

export interface MergeArgs extends InputColumnListArgs, OutputColumnArgs {
	/**
	 * Strategy to use for merging the input columns
	 */
	strategy: MergeStrategy
	/**
	 * Delimiter to use when merging columns into a string.
	 * This is only necessary if MergeStrategy.Concat is used.
	 * If it is not supplied, the values are just mashed together.
	 */
	delimiter?: string
	/**
	 * Indicates that columns should be "unhot" before merging. In other words, replace all 1s with the column name, and 0s with undefined.
	 */
	unhot?: boolean
	/**
	 * Prefix to strip from column names when using unhot (only relevant if columns were originally onehot encoded with a prefix).
	 */
	prefix?: string
	/**
	 * Keep the original columns (default is to remove source columns).
	 */
	preserveSource?: boolean
}

export interface OnehotArgs extends InputColumnArgs {
	/**
	 * Optional prefixes for the output column names
	 */
	prefix?: string
	/**
	 * Keep the original columns (default is to remove source columns).
	 */
	preserveSource?: boolean
}

export interface OrderbyArgs {
	/**
	 * List of ordering instructions to apply
	 */
	orders: OrderbyInstruction[]
}

export interface OrderbyInstruction {
	/**
	 * Name of the column to order by
	 */
	column: string
	/**
	 * Direction to order by
	 */
	direction?: SortDirection
}

export interface PivotArgs extends InputKeyValueArgs {
	/**
	 * Aggregate/rollup operation to perform when doing the pivot.
	 */
	operation: FieldAggregateOperation
}

export interface RecodeArgs extends InputColumnArgs, OutputColumnArgs {
	/**
	 * Mapping of old value to new for the recoding.
	 * Note that the key must be coercible to a string for map lookup.
	 */
	mapping: Record<Value, Value>
}

export type RenameArgs = InputColumnRecordArgs

export interface RollupArgs extends InputColumnArgs, OutputColumnArgs {
	/**
	 * Aggregate/rollup operation
	 */
	operation: FieldAggregateOperation
}

export interface SampleArgs {
	/**
	 * Number of rows to sample from the table.
	 * This takes precedence over proportion.
	 */
	size?: number

	/**
	 * If table size is unknown ahead of time, specify a proportion of rows to sample.
	 * If size is specified, it will be used instead, otherwise computed from this
	 * proportion using the table.numRows()
	 */
	proportion?: number

	/**
	 * The randomization seed to use for sampling to ensure stable sampling.
	 */
	seed?: number
}

export type SelectArgs = InputColumnListArgs

export interface SpreadArgs extends InputColumnArgs {
	to: string[]
	/**
	 * Delimiter to use when converting string cell values into an array with String.split
	 */
	delimiter?: string
	/**
	 * Indicates that a onehot-style spread should be performed.
	 * This maps all unique cell values to new columns and sets the output cell value to a binary 1/0 based on column match.
	 * This is in contrast to the default spread, which just maps array values to column by index.
	 */
	onehot?: boolean
	/**
	 * Keep the original columns (default is to remove source columns).
	 */
	preserveSource?: boolean
}

export type UnfoldArgs = InputKeyValueArgs

export interface UnhotArgs extends InputColumnListArgs, OutputColumnArgs {
	prefix?: string
	/**
	 * Keep the original columns (default is to remove source columns).
	 */
	preserveSource?: boolean
}

export type UnrollArgs = InputColumnArgs

export interface WindowArgs extends InputColumnArgs, OutputColumnArgs {
	/**
	 * Window function to apply to the column.
	 */
	operation: WindowFunction
}
