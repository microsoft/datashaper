/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'

import { ParseType } from '../types/enums.js'
import type { ConvertArgs } from '../types/types.js'
import { bool } from '../util/data-types.js'
import type { TableStep } from '../factories/index.js'

/**
 * Executes an arquero string parse operation.
 */
export const convertStep: TableStep<ConvertArgs> = (
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
