/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum Verb {
	Aggregate = 'aggregate',
	Bin = 'bin',
	Binarize = 'binarize',
	Chain = 'chain',
	Concat = 'concat',
	Dedupe = 'dedupe',
	Derive = 'derive',
	Difference = 'difference',
	Erase = 'erase',
	Fetch = 'fetch',
	Fill = 'fill',
	Filter = 'filter',
	Fold = 'fold',
	Groupby = 'groupby',
	Impute = 'impute',
	Intersect = 'intersect',
	Join = 'join',
	Lookup = 'lookup',
	Merge = 'merge',
	Pivot = 'pivot',
	Orderby = 'orderby',
	Recode = 'recode',
	Rename = 'rename',
	Rollup = 'rollup',
	Sample = 'sample',
	Select = 'select',
	Spread = 'spread',
	Unfold = 'unfold',
	Ungroup = 'ungroup',
	Union = 'union',
	Unorder = 'unorder',
	Unroll = 'unroll',
	Window = 'window',
}

export enum MergeStrategy {
	FirstOneWins = 'first one wins',
	LastOneWins = 'last one wins',
	Concat = 'concat',
	Array = 'array',
}

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

export enum BinStrategy {
	Auto = 'auto',
	FixedCount = 'fixed count',
	FixedWidth = 'fixed width',
}
