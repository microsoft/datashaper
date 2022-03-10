/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape } from 'arquero'
import type { ExprObject } from 'arquero/dist/types/table/transformable'

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { DeriveArgs, Step, TableContainer } from '../../types.js'
import { MathOperator } from '../../types.js'

/**
 * Executes an arquero derive.
 * This basically just supports math operations between two columns.
 * @param step
 * @param store
 * @returns
 */
export async function derive(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { column1, column2, operator, to } = args as DeriveArgs
	const inputTable = await store.table(input)

	// eslint-disable-next-line
	const func = escape((d: any) => {
		const l = d[column1]
		const r = d[column2]
		switch (operator) {
			case MathOperator.Add:
				return l + r
			case MathOperator.Subtract:
				return l - r
			case MathOperator.Multiply:
				return l * r
			case MathOperator.Divide:
				return l / r
			default:
				throw new Error(`Unsupported operator: [${operator}]`)
		}
	})

	const dArgs: ExprObject = {
		[to]: func,
	}
	return container(output, inputTable.derive(dArgs))
}
