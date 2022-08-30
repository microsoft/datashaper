/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SelectArgs } from '@datashaper/schema'
import { all } from 'arquero'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const selectStep: ColumnTableStep<SelectArgs> = (
	input,
	{ columns = [] },
) => {
	const expr = [columns] as any
	if (expr.length === 0) {
		expr.push(all())
	}
	return input.select(...expr)
}

export const select = stepVerbFactory(selectStep)
