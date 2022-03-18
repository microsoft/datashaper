/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { SampleArgs } from '../../types.js'

export const sample = makeStepFunction(doSample)
export const sampleNode = makeStepNode(doSample)

function doSample(input: ColumnTable, { size, proportion }: SampleArgs) {
	const p = Math.round(input.numRows() * (proportion || 1))
	const s = size || p
	return input.sample(s)
}
