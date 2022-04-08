/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BooleanLogicalOperator } from '../../types.js'

/**
 * Evalutes a list of booleans using a logical operator.
 * Because real-world data can have empties, we follow pandas and use three-valued logic.
 * https://en.wikipedia.org/wiki/Three-valued_logic#Kleene_and_Priest_logics
 * We also support single values and more than two.
 * @param comparisons
 * @param logical
 * @returns
 */
export function evaluateBoolean(
	comparisons: (1 | 0 | null)[],
	logical: BooleanLogicalOperator,
): 1 | 0 | null {
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

/**
 * Logical OR. Any match of true is an immediate true.
 * If none are true, null is an unknown state that returns null.
 * Otherwise false.
 * @param comparisons
 * @returns
 */
export function or(comparisons: (1 | 0 | null)[]): 1 | 0 | null {
	let nulls = 0
	for (let i = 0; i < comparisons.length; i++) {
		if (comparisons[i] === null) {
			nulls++
		} else if (comparisons[i] === 1) {
			// shortcut any true immediately
			return 1
		}
	}
	if (nulls >= 1 || comparisons.length === 0) {
		return null
	}
	return 0
}

/**
 * Logical AND. All must be true to return true.
 * Any false returns false. Otherwise any null is an unknown state that returns null.
 * @param comparisons
 * @returns
 */
export function and(comparisons: (1 | 0 | null)[]): 1 | 0 | null {
	let nulls = 0
	for (let i = 0; i < comparisons.length; i++) {
		if (comparisons[i] === 0) {
			// shortcut any false immediately
			return 0
		}
		if (comparisons[i] === null) {
			nulls++
		}
	}
	if (nulls >= 1 || comparisons.length === 0) {
		return null
	}
	return 1
}

/**
 * Logical XOR (exclusive OR). Only one value may be true.
 * If there is more than one true, this will be false.
 * If there are any nulls the result is unknown and will return null.
 * @param comparisons
 * @returns
 */
export function xor(comparisons: (1 | 0 | null)[]): 1 | 0 | null {
	let xor = 0
	let nulls = 0
	for (let i = 0; i < comparisons.length; i++) {
		xor += comparisons[i]!
		if (xor > 1) {
			// shortcut more than one true immediately
			return 0
		}
		if (comparisons[i] === null) {
			nulls++
		}
	}
	if (nulls > 0 || comparisons.length === 0) {
		return null
	}
	if (xor === 1) {
		return 1
	} else {
		return 0
	}
}

/**
 * Logical NOR (not OR).
 * If any value is true, this returns false.
 * If no value is true, but there are nulls, this is unknown and will return null.
 * @param comparisons
 * @returns
 */
export function nor(comparisons: (1 | 0 | null)[]): 1 | 0 | null {
	let nulls = 0
	for (let i = 0; i < comparisons.length; i++) {
		if (comparisons[i] === 1) {
			return 0
		}
		if (comparisons[i] === null) {
			nulls++
		}
	}
	if (nulls > 0 || comparisons.length === 0) {
		return null
	}
	return 1
}

/**
 * Logical NAND (not AND).
 * If any false is false, this returns true.
 * If all values are true, this returns false.
 * If there are no falses but there are nulls, this is unknown and will return null.
 * @param comparisons
 * @returns
 */
export function nand(comparisons: (1 | 0 | null)[]): 1 | 0 | null {
	if (comparisons.length === 0) {
		return null
	}
	let nand = 0
	for (let i = 0; i < comparisons.length; i++) {
		nand += comparisons[i]!
		if (comparisons[i] === 0) {
			return 1
		}
	}
	if (nand === comparisons.length) {
		return 0
	}
	return null
}
