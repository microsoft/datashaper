/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BooleanOperator } from '../types.js'

export function evaluateBoolean(
	comparisons: (1 | 0)[],
	logical: BooleanOperator,
): 1 | 0 {
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
