/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'
import { Op } from 'arquero/dist/types/op/op'
import {
	NumericComparisonOperator,
	FieldAggregateOperation,
	StringComparisonOperator,
	FilterCompareType,
} from '../../types'
import { CompareWrapper } from './types'

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
	operator: NumericComparisonOperator | StringComparisonOperator,
	type: FilterCompareType,
): CompareWrapper {
	return escape((d: Record<string, string | number>): 0 | 1 | undefined => {
		const left = d[column]
		const right = type === FilterCompareType.Column ? d[`${value}`] : value

		// start with the empty operators, because typeof won't work...
		if (
			operator === NumericComparisonOperator.Empty ||
			operator === StringComparisonOperator.Empty
		) {
			return isEmpty(left)
		} else if (
			operator === NumericComparisonOperator.NotEmpty ||
			operator === StringComparisonOperator.NotEmpty
		) {
			const empty = isEmpty(left)
			return empty === 1 ? 0 : 1
			// just turn all the comparisons into numeric based on type so we can simplify the switches
		} else if (typeof left === 'number') {
			const num = +right
			return compareValues(left, num, operator)
		} else if (typeof left === 'string') {
			return compareStrings(left, `${right}`, operator)
			// TODO: boolean enum instead of reusing numeric ops
		} else if (typeof left === 'boolean') {
			const l = left === true ? 1 : 0
			// any non-empty string is a bool, so force true/false
			const bool = right === 'true' ? 1 : 0
			return compareValues(l, bool, operator)
		}
	}) as CompareWrapper
}

function isEmpty(left: string | number | boolean) {
	if (left === null || left === undefined) {
		return 1
	}
	if (typeof left === 'number' && isNaN(left)) {
		return 1
	}
	if (typeof left === 'string' && left.length === 0) {
		return 1
	}
	return 0
}

function compareStrings(left: string, right: string, operator: string): 1 | 0 {
	switch (operator) {
		case StringComparisonOperator.Contains:
			return op.match(left, new RegExp(right, 'gi'), 0) ? 1 : 0
		case StringComparisonOperator.EndsWith:
			return op.endswith(left, right, left.length) ? 1 : 0
		case StringComparisonOperator.Equal:
			return left.localeCompare(right) === 0 ? 1 : 0
		case StringComparisonOperator.NotEqual:
			return left.localeCompare(right) !== 0 ? 1 : 0
		case StringComparisonOperator.StartsWith:
			return op.startswith(left, right, 0) ? 1 : 0
		case StringComparisonOperator.Empty:
		default:
			throw new Error(`Unsupported operator: [${operator}]`)
	}
}

// TODO: I'd kind of prefer if we actually used booleans for the core engine,
// and then map to 1/0 for causal inference inputs using a separate derive operation
// or maybe as an optional that dictates the true/false output value
function compareValues(left: number, right: number, operator: string): 1 | 0 {
	switch (operator) {
		case NumericComparisonOperator.Eq:
			return left === right ? 1 : 0
		case NumericComparisonOperator.NotEq:
			return left !== right ? 1 : 0
		case NumericComparisonOperator.Gte:
			return left >= right ? 1 : 0
		case NumericComparisonOperator.Lte:
			return left <= right ? 1 : 0
		case NumericComparisonOperator.Gt:
			return left > right ? 1 : 0
		case NumericComparisonOperator.Lt:
			return left < right ? 1 : 0
		case NumericComparisonOperator.Empty:
			if (left === null || left === undefined || isNaN(left)) {
				return 1
			}
			return 0
		default:
			throw new Error(`Unsupported operator: [${operator}]`)
	}
}

const fieldOps = new Set(Object.values(FieldAggregateOperation))

// this currently only supports operations that take a single field name
// TODO: we can support a bunch of the window operations too
// note that this uses the aggregate op functions to generate an expression
export function singleRollup(
	column: string,
	operation: FieldAggregateOperation,
): number | Op {
	if (operation === 'count') {
		return op.count()
	} else if (!fieldOps.has(operation)) {
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
