/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	BooleanComparisonOperator,
	DateComparisonOperator,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '@datashaper/schema'
import { op } from 'arquero'

import { bool } from './data-types.js'

export function compareValues(
	left: string | number | boolean | Date,
	right: string | number | boolean | Date,
	operator:
		| NumericComparisonOperator
		| StringComparisonOperator
		| BooleanComparisonOperator
		| DateComparisonOperator,
): 0 | 1 | null {
	// start with the empty operators, because typeof won't work...
	if (
		operator === NumericComparisonOperator.IsEmpty ||
		operator === StringComparisonOperator.IsEmpty ||
		operator === BooleanComparisonOperator.IsEmpty ||
		operator === DateComparisonOperator.IsEmpty
	) {
		return isEmpty(left)
	} else if (
		operator === NumericComparisonOperator.IsNotEmpty ||
		operator === StringComparisonOperator.IsNotEmpty ||
		operator === BooleanComparisonOperator.IsNotEmpty ||
		operator === DateComparisonOperator.IsNotEmpty
	) {
		const empty = isEmpty(left)
		return empty === 1 ? 0 : 1
	} else if (isEmpty(left) || isEmpty(right)) {
		// TODO: we need to differentiate NaN/invalid date
		// but basically if the compare is not explicitly requesting a compare check,
		// null values should be ignored
		return null
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
		const r = !!bool(right)
		return compareBooleans(left, r, operator as BooleanComparisonOperator)
	} else if (typeof left === 'object' && left instanceof Date) {
		return compareDates(left, right as Date, operator as DateComparisonOperator)
	}
	return 0
}

function isEmpty(value: string | number | boolean | Date) {
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

function compareDates(
	left: Date,
	right: Date,
	operator: DateComparisonOperator,
): 1 | 0 {
	switch (operator) {
		case DateComparisonOperator.Equals:
			return left.getTime() === right.getTime() ? 1 : 0
		case DateComparisonOperator.NotEqual:
			return left.getTime() !== right.getTime() ? 1 : 0
		case DateComparisonOperator.After:
			return left > right ? 1 : 0
		case DateComparisonOperator.Before:
			return left < right ? 1 : 0
		default:
			throw new Error(`Unsupported date comparison operator: [${operator}]`)
	}
}
