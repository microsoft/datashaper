/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BooleanOperator } from '../types.js'

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
	logical: BooleanOperator,
): 1 | 0 | null {
	switch (logical) {
		case BooleanOperator.OR:
			return or(comparisons)
		case BooleanOperator.AND:
			return and(comparisons)
		case BooleanOperator.XOR:
			return xor(comparisons)
		case BooleanOperator.NOR:
			return nor(comparisons)
		case BooleanOperator.NAND:
			return nand(comparisons)
		case BooleanOperator.XNOR:
			return xnor(comparisons)
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
 * Logical XOR (exclusive OR). every pairwise comparison must contain one true and one false value.
 * If there are any nulls the result is unknown and will return null.
 * @param comparisons
 * @returns
 */
export function xor(comparisons: (1 | 0 | null)[]): 1 | 0 | null {
	let xor = 0

	if (comparisons.length === 0)
		return null

	for(let i = 0; i < comparisons.length; i++){
		if(comparisons[i] === null)
			return null

		xor = xor + comparisons[i]
	}

	if (xor % 2 != 0 && xor != 0) {
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
 * If any value is false, this returns true.
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

/**
 * Logical XNOR (not XOR): Every pairwise comparison must two true or two false to be true
 * If there are any nulls the result is unknown and will return null.
 * @param comparisons
 * @returns
 */
 export function xnor(comparisons: (1 | 0 | null)[]): 1 | 0 | null {
	let xorResult = xor(comparisons)

	return xorResult === null ? null : xorResult === 1 ? 0 : 1
}