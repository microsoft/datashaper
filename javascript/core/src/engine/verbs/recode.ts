/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { ExprObject } from 'arquero/dist/types/table/transformable'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { RecodeArgs } from '../../types.js'

export const recode = makeStepFunction(doRecode)
export const recodeNode = makeStepNode(doRecode)

/**
 * Executes an arquero derive to map a list of values to new values.
 * Commonly used for recategorization.
 */
function doRecode(input: ColumnTable, { column, to, map }: RecodeArgs) {
	const dArgs: ExprObject = {
		[to]: escape((d: any) => op.recode(d[column], map)),
	}

	return input.derive(dArgs)
}
