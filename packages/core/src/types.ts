/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from './TableStore'

/**
 * A cell value in Arquero
 */
export type Value = any

export type ColumnStats = {
	type: DataType
	count: number
	distinct: number
	invalid: number
	mode: any
	min?: number
	max?: number
	mean?: number
	median?: number
	stdev?: number
	bins?: Bin[]
	categories?: Category[]
}

export type Bin = {
	min: number
	count: number
}

export type Category = {
	name: string
	count: number
}

/**
 * Stores basic meta and stats about a column
 */
export type ColumnMetadata = {
	name: string
	type: DataType
	stats?: ColumnStats
}

export type TableMetadata = {
	rows: number
	cols: number
	/**
	 * Metadata for each column
	 */
	columns: Record<string, ColumnMetadata>
}

export enum MathOperator {
	Add = '+',
	Subtract = '-',
	Multiply = '*',
	Divide = '/',
}

export enum NumericComparisonOperator {
	Eq = '=',
	NotEq = '!=',
	Lt = '<',
	Lte = '<=',
	Gt = '>',
	Gte = '>=',
	NotEmpty = 'is not empty',
	Empty = 'is empty',
}

// TODO: allow regex 'match'?
export enum StringComparisonOperator {
	Equal = 'equals',
	NotEqual = 'is not equal',
	Contains = 'contains',
	StartsWith = 'starts with',
	EndsWith = 'ends with',
	NotEmpty = 'is not empty',
	Empty = 'is empty',
}

export enum SetOp {
	Concat = 'concat',
	Union = 'union',
	Intersect = 'intersect',
	Except = 'except',
}

export enum SortDirection {
	Ascending = 'asc',
	Descending = 'desc',
}

export enum StepType {
	Verb = 'verb',
	Compound = 'compound',
}

export enum FilterCompareType {
	Value = 'value',
	Column = 'column',
}

/**
 * This is the subset of aggregate functions that can operate
 * on a single field so we don't accommodate additional args.
 * See https://uwdata.github.io/arquero/api/op#aggregate-functions
 */
export enum FieldAggregateRollupOperation {
	Any = 'any',
	Count = 'count',
	CountDistinct = 'distinct',
	Valid = 'valid',
	Invalid = 'invalid',
	Max = 'max',
	Min = 'min',
	Sum = 'sum',
	Product = 'product',
	Mean = 'mean',
	Mode = 'mode',
	Median = 'median',
	StDev = 'stdev',
	StDevPopulation = 'stdevp',
	Variance = 'variance',
	ArraryAgg = 'array_agg',
	ArrayAggDistinct = 'array_agg_distinct',
}

export enum BinStrategy {
	Auto = 'auto',
	FixedCount = 'fixed count',
	FixedWidth = 'fixed width',
}

export interface Specification {
	name?: string
	description?: string
	steps?: Step[] | CompoundStep[]
}

// TODO: split out verb/compound types instead of overloading the verb propert
export interface Step {
	type: StepType
	verb: string
	input: string
	output: string
	args: Partial<Args>
	// helpful for documentation in JSON specs
	description?: string
}

export type StepFunction = (
	step: Step,
	store: TableStore,
) => Promise<ColumnTable>

export enum Verb {
	Aggregate = 'aggregate',
	Bin = 'bin',
	Binarize = 'binarize',
	Dedupe = 'dedupe',
	Derive = 'derive',
	Fetch = 'fetch',
	Fill = 'fill',
	Concat = 'concat',
	Except = 'except',
	Impute = 'impute',
	Intersect = 'intersect',
	Union = 'union',
	Fold = 'fold',
	Lookup = 'lookup',
	Groupby = 'groupby',
	Spread = 'spread',
	Unroll = 'unroll',
	Filter = 'filter',
	Join = 'join',
	Orderby = 'orderby',
	Rename = 'rename',
	Rollup = 'rollup',
	Sample = 'sample',
	Select = 'select',
	Ungroup = 'ungroup',
	Unorder = 'unorder',
	Recode = 'recode',
}

export interface CompoundStep extends Step {
	steps: Step[]
}

export interface CompoundBinarizeStep extends CompoundStep {
	as: string
}

export interface AggregateStep extends Step {
	args: AggregateArgs
}

export interface BinStep extends Step {
	args: BinArgs
}

export interface BinarizeStep extends Step {
	args: BinarizeArgs
}

export interface ColumnListStep extends Step {
	args: ColumnListArgs
}

export interface DedupeStep extends Step {
	args: DedupeArgs
}

export interface DeriveStep extends Step {
	args: DeriveArgs
}

export interface ImputeStep extends Step {
	args: FillArgs
}

export interface FetchStep extends Step {
	args: FetchArgs
}

export interface FillStep extends Step {
	args: FillArgs
}

export interface FilterStep extends Step {
	args: FilterArgs
}

export interface FoldStep extends ColumnListStep {
	args: FoldArgs
}

export interface GroupbyStep extends ColumnListStep {
	args: GroupbyArgs
}

export interface JoinStep extends Step {
	args: JoinArgs
}

export interface LookupStep extends Step {
	args: LookupArgs
}

export interface OrderbyStep extends Step {
	args: OrderbyArgs
}

export interface RecodeStep extends Step {
	args: RecodeArgs
}

export interface RenameStep extends Step {
	args: RenameArgs
}

export interface RollupStep extends Step {
	args: RollupArgs
}

export interface SampleStep extends Step {
	args: SampleArgs
}

export interface SelectStep extends Step {
	args: SelectArgs
}

export interface SpreadStep extends ColumnListStep {
	args: SpreadArgs
}

export interface UnrollStep extends ColumnListStep {
	args: UnrollArgs
}

// set operations
// https://uwdata.github.io/arquero/api/verbs#sets
export interface SetOperationStep extends Step {
	args: SetOperationArgs
}

export type Args =
	| AggregateArgs
	| BinArgs
	| BinarizeArgs
	| DedupeArgs
	| DeriveArgs
	| FetchArgs
	| FillArgs
	| FilterArgs
	| FoldArgs
	| GroupbyArgs
	| JoinArgs
	| LookupArgs
	| OrderbyArgs
	| RecodeArgs
	| RenameArgs
	| RollupArgs
	| SampleArgs
	| SelectArgs
	| SetOperationArgs
	| UnrollArgs

export interface OutputColumnArgs {
	/**
	 * Name of the output column to receive the operation's result.
	 */
	as: string
}

export interface RollupArgs extends OutputColumnArgs {
	/**
	 * Column to perform aggregate/rollup operation on
	 */
	field: string
	/**
	 * Aggregate/rollup operation
	 */
	operation: FieldAggregateRollupOperation
}

export interface AggregateArgs extends RollupArgs {
	/**
	 * Column to group by
	 */
	groupby: string
}

export interface BinArgs extends OutputColumnArgs {
	field: string

	strategy: BinStrategy
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
}

export interface BinarizeArgs extends FilterArgs, OutputColumnArgs {}

/**
 * Base interface for a number of operations that work on a column list.
 */
export interface ColumnListArgs {
	columns: string[]
}

export interface ColumnListOptionalArgs {
	columns?: string[]
}

export interface ColumnRecordArgs {
	/**
	 * Map of old column to new column names
	 */
	columns: Record<string, string>
}

export interface DeriveArgs extends OutputColumnArgs {
	/**
	 * Column on the left side of the operation
	 */
	column1: string
	/**
	 * Column on the right side of the operation
	 */
	column2: string

	operator: MathOperator
}

export interface FetchArgs {
	/**
	 * URL where the csv file is located
	 */
	url: string
	/**
	 * Optional delimiter for csv
	 */
	delimiter?: string
}

export interface FillArgs extends OutputColumnArgs {
	/**
	 * Value to fill in the new column
	 */
	value: Value
	as: string
}

export interface FilterArgs {
	/**
	 * Column on the left side of the operation
	 */
	column: string
	/**
	 * Comparison value for the column
	 */
	value: Value
	/**
	 * Indicates whether the filter should be directly against a value,
	 * or against the value of another column
	 */
	type: FilterCompareType
	operator: NumericComparisonOperator | StringComparisonOperator
}

export interface FoldArgs extends ColumnListArgs {
	/**
	 * Two-element array of names for the output [key, value]
	 * TODO: consider renaming - while this is the arg name in arquero,
	 * it's overloaded. Usually just a single string, but some verbs
	 * it is even an arbitrary length array.
	 */
	as?: [string, string]
}

export type GroupbyArgs = ColumnListArgs

export type DedupeArgs = ColumnListOptionalArgs

export interface JoinArgs {
	/**
	 * Name of the other table to join to the main input
	 */
	other: string
	/**
	 * Column names to join with.
	 * If only one is specified, it will use for both tables.
	 * If none are specified, all matching column names will be used.
	 */
	on?: string[]
}

export interface LookupArgs extends JoinArgs, ColumnListArgs {}

export interface RecodeArgs extends OutputColumnArgs {
	/**
	 * Name of the column to map new values for.
	 */
	column: string
	/**
	 * Mapping of old value to new for the recoding.
	 * Note that the key must be coercable to a string for map lookup.
	 */
	map: Record<Value, Value>
}

export type RenameArgs = ColumnRecordArgs

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
}

export interface SelectArgs extends ColumnRecordArgs {
	// TODO: spruce this up for consistency (columns is an object - maybe it should combine with true/false)
	not?: string[]
}

export type SpreadArgs = ColumnListArgs

export interface OrderbyInstruction {
	column: string
	direction?: SortDirection
}

export interface OrderbyArgs {
	/**
	 * List of ordering instructions to apply
	 */
	orders: OrderbyInstruction[]
}

export interface SetOperationArgs {
	/**
	 * Other tables to apply this set operation to.
	 */
	others: string[]
}

export type UnrollArgs = ColumnListArgs

export enum DataType {
	Array = 'array',
	Boolean = 'boolean',
	Date = 'date',
	Number = 'number',
	String = 'string',
	Text = 'text',
	Object = 'object',
	Undefined = 'undefined',
}
