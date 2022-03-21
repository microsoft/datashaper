/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../container.js'
import type { DedupeArgs,TableContainer  } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const dedupe = makeStepFunction(doDedupe)
export const dedupeNode = makeStepNode(doDedupe)

/**
 * Executes an arquero dedupe operation.
 */
function doDedupe(id: string, input: TableContainer, { columns }: DedupeArgs) {
	let result: ColumnTable | undefined
	if (input.table != null) {
		result = columns ? input.table.dedupe(columns) : input.table.dedupe()
	}
	return container(id, result)
}
