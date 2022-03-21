/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'

import type { ConvertArgs } from '../../types.js'
import { ParseType } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'
import { bool } from '../util/data-types.js'

/**
 * Executes an arquero string parse operation.
 */
const doConvert = wrapColumnStep<ConvertArgs>(
	(input, { columns, type, radix }) => {
		// note that this applies the specified parse to every column equally
		const dArgs = columns.reduce((acc, cur) => {
			acc[cur] = parseType(cur, type, radix)
			return acc
		}, {} as any)
		return input.derive(dArgs)
	},
)

export const convert = makeStepFunction(doConvert)
export const convertNode = makeStepNode(doConvert)

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
