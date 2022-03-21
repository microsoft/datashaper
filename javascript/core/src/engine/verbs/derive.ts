/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { ExprObject } from 'arquero/dist/types/table/transformable'

import { container } from '../../container.js'
import type { DeriveArgs, TableContainer } from '../../types.js'
import { MathOperator } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const derive = makeStepFunction(doDerive)
export const deriveNode = makeStepNode(doDerive)

/**
 * Executes an arquero derive.
 * This basically just supports math operations between two columns.
 */
function doDerive(
	id: string,
	input: TableContainer,
	{ column1, column2, operator, to }: DeriveArgs,
) {
	let result: ColumnTable | undefined
	if (input.table != null) {
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
		result = input.table.derive(dArgs)
	}
	return container(id, result)
}
