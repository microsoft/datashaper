/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { DedupeArgs } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const dedupe = makeStepFunction(doDedupe)
export const dedupeNode = makeStepNode(doDedupe)

/**
 * Executes an arquero dedupe operation.
 */
function doDedupe(input: ColumnTable, { columns }: DedupeArgs) {
	return columns ? input.dedupe(columns) : input.dedupe()
}
