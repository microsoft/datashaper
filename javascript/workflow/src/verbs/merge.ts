/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '@datashaper/schema'
import { MergeStrategy } from '@datashaper/schema'
import { escape, not } from 'arquero'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import {
	arrayStrategy,
	concatStrategy,
	firstOneWinsStrategy,
	lastOneWinsStrategy,
} from './util/merge.js'
import { unhotOperation } from './util/unhot-logic.js'

export const mergeStep: ColumnTableStep<MergeArgs> = (
	input,
	{
		columns = [],
		strategy,
		to,
		delimiter = '',
		unhot = false,
		prefix = '',
		keepOriginalColumns = false,
	},
) => {
	const tempTable = unhot ? unhotOperation(input, columns, prefix) : input

	// eslint-disable-next-line
	const func: object = escape((d: any) => {
		switch (strategy) {
			case MergeStrategy.LastOneWins:
				return lastOneWinsStrategy(d, columns)
			case MergeStrategy.Concat:
				return concatStrategy(d, columns, delimiter)
			case MergeStrategy.CreateArray:
				return arrayStrategy(d, columns)
			case MergeStrategy.FirstOneWins:
			default:
				return firstOneWinsStrategy(d, columns)
		}
	})

	if (keepOriginalColumns) return tempTable.derive({ [to]: func })

	return tempTable.derive({ [to]: func }).select(not(columns))
}

export const merge = stepVerbFactory(mergeStep)
