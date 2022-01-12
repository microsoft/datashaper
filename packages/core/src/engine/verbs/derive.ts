/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { ExprObject } from 'arquero/dist/types/table/transformable'
import { TableStore } from '../..'
import { DeriveArgs, MathOperator, Step } from '../../types'

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
): Promise<ColumnTable> {
	const { input, args } = step
	const { column1, column2, operator, to } = args as DeriveArgs
	const inputTable = await store.get(input)

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
	return inputTable.derive(dArgs)
}
