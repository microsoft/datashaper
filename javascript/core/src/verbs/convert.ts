/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'

import type { ColumnTableStep } from './util/factories.js'
import type { InputColumnListArgs } from './types.js'
import { ParseType } from './types.js'
import { bool } from './util/data-types.js'
import { stepVerbFactory } from './util/factories.js'

export interface ConvertArgs extends InputColumnListArgs {
	type: ParseType
	/**
	 * Optional radix to use for parsing strings into ints
	 */
	radix?: number
}

/**
 * Executes an arquero string parse operation.
 */
export const convertStep: ColumnTableStep<ConvertArgs> = (
	input,
	{ columns, type, radix },
) => {
	// note that this applies the specified parse to every column equally
	const dArgs = columns.reduce((acc, cur) => {
		acc[cur] = parseType(cur, type, radix)
		return acc
	}, {} as any)
	return input.derive(dArgs)
}

function parseType(column: string, type: ParseType, radix?: number) {
	return escape((d: any) => {
		const value = d[column]
		switch (type) {
			case ParseType.Boolean:
				// arquero has no boolean operation
				return bool(value)
			case ParseType.Date:
				return op.parse_date(value)
			case ParseType.Integer:
				return op.parse_int(value, radix)
			case ParseType.Decimal:
				return op.parse_float(value)
		}
	})
}

export const convert = stepVerbFactory(convertStep)
