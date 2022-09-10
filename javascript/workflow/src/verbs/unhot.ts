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
	{ columns = [], to, prefix = '', preserveSource = false },
) => {
	// map 1/0 back to column name values
	const mapped = unhotOperation(input, columns, prefix)
	// merge back to a single column
	const merged = mapped.derive({
		[to]: escape((d: any) => firstOneWinsStrategy(d, columns)),
	})
	return preserveSource ? merged : merged.select(not(columns))
}

export const unhot = stepVerbFactory(unhotStep)
