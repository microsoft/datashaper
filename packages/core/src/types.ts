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

export enum DataType {
	Array = 'array',
	Boolean = 'boolean',
	Date = 'date',
	Number = 'number',
	String = 'string',
	Text = 'text',
	Object = 'object',
	Undefined = 'undefined',
	Unknown = 'unknown',
}

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
	min: number | string
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
	Difference = 'difference',
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
export enum FieldAggregateOperation {
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

export type OrderbyInstruction = {
	column: string
	direction?: SortDirection
}

export interface Specification {
	name?: string
	description?: string
	steps?: Step[] | CompoundStep[]
}

// TODO: split out verb/compound types instead of overloading the verb property
export interface Step<T = unknown> {
	type: StepType
	verb: Verb
	input: string
	output: string
	args: T
	// helpful for documentation in JSON specs
	description?: string
}

export interface CompoundStep extends Step {
	steps: Step[] | CompoundStep[]
}

export type StepFunction = (
	step: Step,
	store: TableStore,
) => Promise<ColumnTable>

export enum Verb {
	Aggregate = 'aggregate',
	Bin = 'bin',
	Binarize = 'binarize',
	Chain = 'chain',
	Concat = 'concat',
	Dedupe = 'dedupe',
	Derive = 'derive',
	Difference = 'difference',
	Fetch = 'fetch',
	Fill = 'fill',
	Filter = 'filter',
	Fold = 'fold',
	Groupby = 'groupby',
	Impute = 'impute',
	Intersect = 'intersect',
	Join = 'join',
	Lookup = 'lookup',
	Orderby = 'orderby',
	Recode = 'recode',
	Rename = 'rename',
	Rollup = 'rollup',
	Sample = 'sample',
	Select = 'select',
	Spread = 'spread',
	Ungroup = 'ungroup',
	Union = 'union',
	Unorder = 'unorder',
	Unroll = 'unroll',
}

export interface CompoundBinarizeStep extends CompoundStep {
	to: string
}

export type AggregateStep = Step<AggregateArgs>
export type BinStep = Step<BinArgs>
export type BinarizeStep = Step<BinarizeArgs>
export type ColumnListStep = Step<InputColumnListArgs>
export type DedupeStep = Step<DedupeArgs>
export type DeriveStep = Step<DeriveArgs>
export type ImputeStep = Step<FillArgs>
export type FetchStep = Step<FetchArgs>
export type FillStep = Step<FillArgs>
export type FilterStep = Step<FilterArgs>
export type FoldStep = Step<FoldArgs>
export type GroupbyStep = Step<GroupbyArgs>
export type JoinStep = Step<JoinArgs>
export type LookupStep = Step<LookupArgs>
export type OrderbyStep = Step<OrderbyArgs>
export type RecodeStep = Step<RecodeArgs>
export type RenameStep = Step<RenameArgs>
export type RollupStep = Step<RollupArgs>
export type SampleStep = Step<SampleArgs>
export type SelectStep = Step<SelectArgs>
export type SpreadStep = Step<SpreadArgs>
export type UnrollStep = Step<UnrollArgs>
export type SetOperationStep = Step<SetOperationArgs>

// reusable base interfaces to aid consistency

export interface InputColumnArgs {
	/**
	 * Name of the input column for columnnar operations.
	 */
	column: string
}

/**
 * Base interface for a number of operations that work on a column list.
 */
export interface InputColumnListArgs {
	columns: string[]
}

export interface InputColumnRecordArgs {
	/**
	 * Map of old column to new column names
	 */
	columns: Record<string, string>
}

export interface OutputColumnArgs {
	/**
	 * Name of the output column to receive the operation's result.
	 */
	to: string
}

export interface AggregateArgs extends RollupArgs {
	/**
	 * Column to group by
	 */
	groupby: string
}

export interface BinArgs extends InputColumnArgs, OutputColumnArgs {
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

export interface ChainArgs {
	/**
	 * List of steps to execute
	 */
	steps: Step<unknown>[]
	/**
	 * Whether to prevent forking of child context when running steps recursively.
	 * Normally the Chain clones the parent context to prevent pollution.
	 */
	nofork: boolean
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
}

export interface FilterArgs extends InputColumnArgs {
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

export interface LookupArgs extends JoinArgs, InputColumnListArgs {}

export interface RecodeArgs extends InputColumnArgs, OutputColumnArgs {
	/**
	 * Mapping of old value to new for the recoding.
	 * Note that the key must be coercable to a string for map lookup.
	 */
	map: Record<Value, Value>
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
}

export type SelectArgs = InputColumnListArgs

export type SpreadArgs = InputColumnListArgs

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

export type UnrollArgs = InputColumnListArgs
