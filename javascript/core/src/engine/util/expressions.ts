/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'
import type { Op } from 'arquero/dist/types/op/op'

import type {
	BooleanComparisonOperator,
	Criterion,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '../../types.js'
import {
	BooleanLogicalOperator,
	FieldAggregateOperation,
	FilterCompareType,
	WindowFunction,
} from '../../types.js'
import { compareValues } from './compare.js'
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

function evaluateBoolean(
	comparisons: (1 | 0)[],
	logical: BooleanLogicalOperator,
): 1 | 0 {
	switch (logical) {
		case BooleanLogicalOperator.OR:
			return or(comparisons)
		case BooleanLogicalOperator.AND:
			return and(comparisons)
		case BooleanLogicalOperator.XOR:
			return xor(comparisons)
		case BooleanLogicalOperator.NOR:
			return nor(comparisons)
		case BooleanLogicalOperator.NAND:
			return nand(comparisons)
		default:
			throw new Error(`Unsupported logical operator: [${logical}]`)
	}
}

function or(comparisons: (1 | 0)[]): 1 | 0 {
	return comparisons.some(c => c === 1) ? 1 : 0
}

function and(comparisons: (1 | 0)[]): 1 | 0 {
	return comparisons.every(c => c === 1) ? 1 : 0
}

function xor(comparisons: (1 | 0)[]): 1 | 0 {
	let xor = 0
	for (let i = 0; i < comparisons.length; i++) {
		xor += comparisons[i]!
		if (xor > 1) {
			return 0
		}
	}
	if (xor === 1) {
		return 1
	} else {
		return 0
	}
}

function nor(comparisons: (1 | 0)[]): 1 | 0 {
	return comparisons.some(c => c === 1) ? 0 : 1
}

function nand(comparisons: (1 | 0)[]): 1 | 0 {
	let nand = 0
	for (let i = 0; i < comparisons.length; i++) {
		nand += comparisons[i]!
		if (nand < 0) {
			return 1
		}
	}
	if (nand === comparisons.length) {
		return 0
	} else {
		return 1
	}
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
