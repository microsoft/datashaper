/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'
import type { Op } from 'arquero/dist/types/op/op'

import type { Criterion } from '../../types.js'
import {
	BooleanComparisonOperator,
	BooleanLogicalOperator,
	FieldAggregateOperation,
	FilterCompareType,
	NumericComparisonOperator,
	StringComparisonOperator,
	WindowFunction,
} from '../../types.js'
import { bool } from './data-types.js'
import type { CompareWrapper } from './types.js'

export function compareAll(
	column: string,
	criteria: Criterion[],
	logical = BooleanLogicalOperator.OR,
): CompareWrapper {
	return escape((d: Record<string, string | number>): 0 | 1 | undefined => {
		const left = d[column]!
		const comparisons = criteria.map(filter => {
			const { value, operator, type } = filter
			const right =
				type === FilterCompareType.Column ? d[`${value.toString()}`]! : value
			return compareFunction(left, right, operator)
		})
		return evaluateBoolean(comparisons, logical)
	}) as CompareWrapper
}

function evaluateBoolean(
	comparisons: (1 | 0)[],
	logical: BooleanLogicalOperator,
): 1 | 0 {
	let match: 0 | 1 = 0
	switch (logical) {
		case BooleanLogicalOperator.OR:
			match = comparisons.some(c => c === 1) ? 1 : 0
			break
		case BooleanLogicalOperator.AND:
			match = comparisons.every(c => c === 1) ? 1 : 0
			break
		default:
			throw new Error()
	}
	return match
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

		return compareFunction(left, right, operator)
	}) as CompareWrapper
}

function compareFunction(
	left: string | number | boolean,
	right: string | number | boolean,
	operator:
		| NumericComparisonOperator
		| StringComparisonOperator
		| BooleanComparisonOperator,
): 0 | 1 {
	// start with the empty operators, because typeof won't work...
	if (
		operator === NumericComparisonOperator.IsEmpty ||
		operator === StringComparisonOperator.IsEmpty ||
		operator === BooleanComparisonOperator.IsEmpty
	) {
		return isEmpty(left)
	} else if (
		operator === NumericComparisonOperator.IsNotEmpty ||
		operator === StringComparisonOperator.IsNotEmpty ||
		operator === BooleanComparisonOperator.IsNotEmpty
	) {
		const empty = isEmpty(left)
		return empty === 1 ? 0 : 1
	} else if (typeof left === 'number') {
		const num = +right
		return compareValues(left, num, operator as NumericComparisonOperator)
	} else if (typeof left === 'string') {
		return compareStrings(
			left,
			`${right}`,
			operator as StringComparisonOperator,
		)
	} else if (typeof left === 'boolean') {
		const r = bool(right)
		return compareBooleans(left, r, operator as BooleanComparisonOperator)
	}
	return 0
}

function isEmpty(value: string | number | boolean) {
	if (value === null || value === undefined) {
		return 1
	}
	if (typeof value === 'number' && isNaN(value)) {
		return 1
	}
	if (typeof value === 'string' && value.length === 0) {
		return 1
	}
	return 0
}

function compareStrings(
	left: string,
	right: string,
	operator: StringComparisonOperator,
): 1 | 0 {
	const ll = left.toLocaleLowerCase()
	const rl = right.toLocaleLowerCase()
	switch (operator) {
		case StringComparisonOperator.Contains:
		case StringComparisonOperator.RegularExpression:
			return op.match(ll, new RegExp(rl, 'gi'), 0) ? 1 : 0
		case StringComparisonOperator.EndsWith:
			return op.endswith(ll, rl, ll.length) ? 1 : 0
		case StringComparisonOperator.Equals:
			return ll.localeCompare(rl) === 0 ? 1 : 0
		case StringComparisonOperator.NotEqual:
			return ll.localeCompare(rl) !== 0 ? 1 : 0
		case StringComparisonOperator.StartsWith:
			return op.startswith(ll, rl, 0) ? 1 : 0
		default:
			throw new Error(`Unsupported string comparison operator: [${operator}]`)
	}
}

function compareValues(
	left: number,
	right: number,
	operator: NumericComparisonOperator,
): 1 | 0 {
	switch (operator) {
		case NumericComparisonOperator.Equals:
			return left === right ? 1 : 0
		case NumericComparisonOperator.NotEqual:
			return left !== right ? 1 : 0
		case NumericComparisonOperator.GreaterThanOrEqual:
			return left >= right ? 1 : 0
		case NumericComparisonOperator.LessThanOrEqual:
			return left <= right ? 1 : 0
		case NumericComparisonOperator.GreaterThan:
			return left > right ? 1 : 0
		case NumericComparisonOperator.LessThan:
			return left < right ? 1 : 0
		default:
			throw new Error(`Unsupported numeric comparison operator: [${operator}]`)
	}
}

function compareBooleans(
	left: boolean,
	right: boolean,
	operator: BooleanComparisonOperator,
): 1 | 0 {
	switch (operator) {
		case BooleanComparisonOperator.Equals:
			return left === right ? 1 : 0
		case BooleanComparisonOperator.NotEqual:
			return left !== right ? 1 : 0
		case BooleanComparisonOperator.IsTrue:
			return left === true ? 1 : 0
		case BooleanComparisonOperator.IsFalse:
			return left === false ? 1 : 0
		default:
			throw new Error(`Unsupported boolean comparison operator: [${operator}]`)
	}
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

export function fixedBinCount(
	column: string,
	min: number,
	max: number,
	count: number,
	clamped?: boolean,
	distinct?: number,
): string | object {
	const step = (max - min) / count
	return fixedBinStep(column, min, max, step, clamped, distinct)
}

export function fixedBinStep(
	column: string,
	min: number,
	max: number,
	step: number,
	clamped?: boolean,
	distinct?: number,
): string | object {
	const count = Math.ceil((max - min) / step)
	const ultimate = min + step * count
	const penultimate = min + step * (count - 1)
	// if the ultimate bin is >= the max, put those values in the prior bin
	// this is due to arquero's exclusive max bound, which will just bin those exact
	// matches into the final bin, disrupting the expected bin count by adding one
	const rebinmax = ultimate >= max
	const nobin = distinct !== undefined && distinct <= count
	return escape((d: any) => {
		const value = d[column]
		if (nobin) {
			return value
		}
		const candidate = op.bin(value, min, max, step)
		if (clamped) {
			if (candidate === -Infinity) {
				return min
			} else if (candidate === Infinity) {
				return rebinmax ? penultimate : ultimate
			}
		}
		return candidate === max && rebinmax ? penultimate : candidate
	})
}
