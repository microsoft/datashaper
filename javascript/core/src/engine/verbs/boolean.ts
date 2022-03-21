/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'
import { deriveBoolean } from '../util/expressions.js'

const doBoolean = wrapColumnStep<BooleanArgs>(
	(input, { columns = [], operator, to }) =>
		input.derive({ [to]: deriveBoolean(columns, operator) }),
)
/**
 * Executes an boolean operation across columns.
 * @param step
 * @param store
 * @returns
 */
export const boolean = makeStepFunction(doBoolean)
export const binarizeNode = makeStepNode(doBoolean)
