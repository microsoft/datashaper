/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'
import type { Op } from 'arquero/dist/types/op/op'

import type {
	BooleanComparisonOperator,
	NumericComparisonOperator,
	StringComparisonOperator} from '../types/index.js';
import {
	BooleanLogicalOperator,
	FieldAggregateOperation,
	FilterCompareType,
	WindowFunction,
} from '../types/index.js'
import type { Criterion } from '../types/types.js'
import { evaluateBoolean } from './boolean-logic.js'
import { compareValues } from './compare.js'
import { bool } from './data-types.js'
import type { CompareWrapper } from './types.js'

export function compareAll(
	column: string,
	criteria: Criterion[],
	logical = BooleanLogicalOperator.OR,
): CompareWrapper {
	return escape((d: Record<string, string | number>): 0 | 1 | undefined => {
		const left = d[column]!
		// TODO: the logical evaluate below has shortcuts that could optimize
		// this check by shortcutting evaluation once it is clear the logical operator
		// cannot be satisfied
		const comparisons = criteria.map(filter => {
			const { value, operator, type } = filter
			const right =
				type === FilterCompareType.Column ? d[`${value.toString()}`]! : value
			return compareValues(left, right, operator)
		})
		return evaluateBoolean(comparisons, logical)
	}) as CompareWrapper
}

/**
 * This creates an arquero expression suitable for comparison of direct values or columns.
 * It automatically handles these comparisons by data type for the column (using the input column for type check).
 * Note that this does need to escape the arquero expression in order to support dynamic variables, so there may
 * be a performance penalty with large tables.
 * @param column
 * @param value
 * @param operator
 * @param type
 * @returns
 */
export function compare(
	column: string,
	value: string | number | boolean,
	operator:
		| NumericComparisonOperator
		| StringComparisonOperator
		| BooleanComparisonOperator,
	type: FilterCompareType,
): CompareWrapper {
	return escape((d: Record<string, string | number>): 0 | 1 | undefined => {
		const left = d[column]!
		const right =
			type === FilterCompareType.Column ? d[`${value.toString()}`]! : value

		return compareValues(left, right, operator)
	}) as CompareWrapper
}

/**
 * Takes a list of columns and compares their values using boolean logical operators
 * to return a boolean result.
 * Input values will be coerced to booleans from any original type, and compared
 * as binary 1s and 0s, with the resulting output being a 1 or 0
 * @param columns
 * @param operator
 * @returns
 */
export function deriveBoolean(
	columns: string[],
	operator: BooleanLogicalOperator,
): CompareWrapper {
	return escape((d: Record<string, string | number>): 0 | 1 => {
		// gather all of the column values, coerce to booleans
		const values = columns.map(c => (bool(d[c]) ? 1 : 0))
		return evaluateBoolean(values, operator)
	}) as CompareWrapper
}

const fieldOps = new Set([
	...Object.values(FieldAggregateOperation),
	...Object.values(WindowFunction),
])

// this currently only supports operations that take a single field name
// note that this uses the aggregate op functions to generate an expression
export function singleExpression(
	column: string,
	operation: FieldAggregateOperation | WindowFunction,
): number | Op {
	if (!fieldOps.has(operation)) {
		throw new Error(
			`Unsupported operation [${operation}], too many parameters needed`,
		)
	}
	return op[operation](column)
}
