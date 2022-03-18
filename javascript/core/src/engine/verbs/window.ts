/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { WindowArgs } from '../../types.js'
import { singleExpression } from '../util/index.js'

export const window = makeStepFunction(doWindow)
export const windowNode = makeStepNode(doWindow)

function doWindow(input: ColumnTable, { column, operation, to }: WindowArgs) {
	const expr = singleExpression(column, operation)
	const dArgs = { [to]: expr }
	return input.derive(dArgs)
}
