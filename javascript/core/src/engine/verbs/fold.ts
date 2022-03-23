/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '../../types.js'
import { makeStepNode } from '../factories.js'

/**
 * Executes an arquero fold operation. This creates two new columns:
 * one with the column name as key, the other with the row value.
 */
export const fold = makeStepNode<FoldArgs>((input, { columns, to }) =>
	input.fold(columns, { as: to }),
)
