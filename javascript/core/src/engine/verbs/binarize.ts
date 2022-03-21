/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../container.js'
import type { BinarizeArgs,TableContainer  } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'
import { compareAll } from '../util/index.js'

export const binarize = makeStepFunction(doBinarize)
export const binarizeNode = makeStepNode(doBinarize)

/**
 * Executes an arquero derive where the output is a 1 or 0.
 */
function doBinarize(
	id: string,
	input: TableContainer,
	{ to, column, criteria }: BinarizeArgs,
) {
	let result: ColumnTable | undefined
	if (input.table != null) {
		const expr = compareAll(column, criteria)
		const dArgs = { [to]: expr }
		result = input.table.derive(dArgs)
	}
	return container(id, result)
}
