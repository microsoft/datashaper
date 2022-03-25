/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape } from 'arquero'

import type { TableStep } from './nodeFactories/index.js'
import type { OutputColumnArgs } from './types.js'
import { MathOperator } from './types.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export interface DeriveArgs extends OutputColumnArgs {
	/**
	 * Column on the left side of the operation
	 */
	column1: string
	/**
	 * Column on the right side of the operation
	 */
	column2: string

	operator: MathOperator
}

/**
 * Executes an arquero derive.
 * This basically just supports math operations between two columns.
 */
export const deriveStep: TableStep<DeriveArgs> = (
	input,
	{ column1, column2, operator, to },
) => {
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

	return input.derive({ [to]: func })
}

export const derive = stepNodeFactory(deriveStep)
