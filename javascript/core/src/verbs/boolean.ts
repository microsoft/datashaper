/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '../types.js'
import { makeStepNode } from './util/factories.js'
import { deriveBoolean } from './util/expressions.js'

/**
 * Executes an boolean operation across columns.
 */
export const boolean = makeStepNode<BooleanArgs>(
	(input, { columns = [], operator, to }) =>
		input.derive({ [to]: deriveBoolean(columns, operator) }),
)
