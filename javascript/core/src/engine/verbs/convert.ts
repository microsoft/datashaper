/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { escape, op } from 'arquero'

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { ConvertArgs, Step, TableContainer } from '../../types.js'
import { ParseType } from '../../types.js'

/**
 * Executes an arquero string parse operation.
 * @param step
 * @param store
 * @returns
 */
export async function convert(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { columns, type, radix } = args as ConvertArgs
	const inputTable = await store.table(input)

	// note that this applies the specified parse to every column equally
	const dArgs = columns.reduce((acc, cur) => {
		acc[cur] = parseType(cur, type, radix)
		return acc
	}, {} as any)

	return container(output, inputTable.derive(dArgs))
}

function parseType(column: string, type: ParseType, radix?: number) {
	return escape((d: any) => {
		const value = d[column]
		switch (type) {
			case ParseType.Boolean:
				// arquero has no boolean operation
				// note that any string, even 'false' becomes true with the boolean constructor
				// that's not likely the right way to interpret data table content, however
				if (value === 'false') {
					return false
					// for all other intents and purposes, a truthy value should be coerced
				} else if (value) {
					return true
				}
				return false
			case ParseType.Date:
				return op.parse_date(value)
			case ParseType.Integer:
				return op.parse_int(value, radix)
			case ParseType.Decimal:
				return op.parse_float(value)
		}
	})
}
