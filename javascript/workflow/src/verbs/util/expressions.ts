/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	BooleanComparisonOperator,
	Criteria,
	DateComparisonOperator,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '@datashaper/schema'
import {
	BooleanOperator,
	FieldAggregateOperation,
	ComparisonStrategy,
	WindowFunction,
} from '@datashaper/schema'
import { parseBoolean } from '@datashaper/tables'
import { addWindowFunction, escape, op } from 'arquero'
import type { Op } from 'arquero/dist/types/op/op'

import { v4 as uuid } from 'uuid'
import { evaluateBoolean } from './boolean-logic.js'
import { compareValues } from './compare.js'
import type { CompareWrapper } from './types.js'

export function compareAll(
	column: string,
	criteria: Criteria[],
	logical = BooleanOperator.OR,
): CompareWrapper {
	return escape((d: Record<string, string | number>): 0 | 1 | null => {
		const left = d[column]

		// TODO: the logical evaluate below has shortcuts that could optimize
		// this check by shortcutting evaluation once it is clear the logical operator
		// cannot be satisfied
		const comparisons = criteria.map((filter) => {
			const { value, operator, strategy } = filter
			const right =
				strategy === ComparisonStrategy.Column
					? d[`${value.toString()}`]
					: value

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
		| BooleanComparisonOperator
		| DateComparisonOperator,
	strategy: ComparisonStrategy,
): CompareWrapper {
	return escape((d: Record<string, string | number>): 0 | 1 | null => {
		const left = d[column]
		const right =
			strategy === ComparisonStrategy.Column ? d[`${value.toString()}`] : value

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
	operator: BooleanOperator,
): CompareWrapper {
	const parseBool = parseBoolean([], ['1'], ['0'])
	return escape((d: Record<string, string | number>): 0 | 1 | null => {
		// gather all of the column values, coerce to booleans (or null)
		const values = columns.map((c) => {
			const val = parseBool(`${d[c]}`)
			return val === null ? null : val ? 1 : 0
		})
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

	return (op as any)[operation](column)
}

addWindowFunction(WindowFunction.UUID, {
	create: () => ({
		init: () => {},
		value: (column: string) => (column !== null ? uuid() : ''),
	}),
	param: [1, 0],
})
