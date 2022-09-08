/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnhotArgs } from '@datashaper/schema'
import { escape, not } from 'arquero'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import { firstOneWinsStrategy } from './util/merge.js'
import { unhotOperation } from './util/unhot-logic.js'

export const unhotStep: ColumnTableStep<UnhotArgs> = (
	input,
	{ columns = [], to, prefix = '', keepOriginalColumns = false },
) => {
	const tempTable = unhotOperation(input, columns, prefix)

	// eslint-disable-next-line
	const func: object = escape((d: any) => {
		return firstOneWinsStrategy(d, columns)
	})

	if (keepOriginalColumns) return tempTable.derive({ [to]: func })

	return tempTable.derive({ [to]: func }).select(not(columns))
}

export const unhot = stepVerbFactory(unhotStep)
