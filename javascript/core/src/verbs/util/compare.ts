/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { op } from 'arquero'

import {
	BooleanComparisonOperator,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '../enums.js'
import { bool } from './data-types.js'

export function compareValues(
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
		return compareNumbers(left, num, operator as NumericComparisonOperator)
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

function compareNumbers(
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
