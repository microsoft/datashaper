/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { BinarizeArgs } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'
import { compareAll } from '../util/index.js'

export const binarize = makeStepFunction(doBinarize)
export const binarizeNode = makeStepNode(doBinarize)

/**
 * Executes an arquero derive where the output is a 1 or 0.
 */
function doBinarize(
	input: ColumnTable,
	{ to, column, criteria }: BinarizeArgs,
) {
	const expr = compareAll(column, criteria)
	const dArgs = { [to]: expr }
	return input.derive(dArgs)
}
