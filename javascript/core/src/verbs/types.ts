/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer, Value } from '@essex/arquero'
import type { Node } from '@essex/dataflow'

export type NodeFactory = (id: string) => Node<TableContainer>

//
// region reusable base interfaces to aid consistency
//

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
	operator:
		| NumericComparisonOperator
		| StringComparisonOperator
		| BooleanComparisonOperator
		| DateComparisonOperator
}

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
	Union = 'union',
	Unorder = 'unorder',
	Unroll = 'unroll',
	Window = 'window',
}

/**
 * This is a subset of data types available for parsing operations
 */
export enum ParseType {
	Boolean = 'boolean',
	Date = 'date',
	Integer = 'int',
	/**
	 * Arquero has a parse_float and parse_int.
	 * While both are a 'number' in JavaScript, the distinction
	 * allows users to control how a string is interpreted.
	 */
	Decimal = 'float',
	String = 'string',
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
	 * Any number conditions can match but not all of them for the result to be true
	 */
	NAND = 'nand',
	/**
	 * Only exactly one condition can match for the result to be true
	 */
	XOR = 'xor',
}

export enum SetOp {
	Concat = 'concat',
	Union = 'union',
	Intersect = 'intersect',
	Difference = 'difference',
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
	StandardDeviation = 'stdev',
	StandardDeviationPopulation = 'stdevp',
	Variance = 'variance',
	CreateArray = 'array_agg',
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
