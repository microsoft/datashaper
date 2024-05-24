/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FoldArgs } from '@datashaper/schema'

import { not, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type { FoldOptions } from 'arquero/dist/types/table/transformable.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const foldStep: ColumnTableStep<FoldArgs> = (
	input,
	{ columns, to, preserveSource = false },
) => {
	const options = { as: to }
	return preserveSource
		? preserve(input, columns, options)
		: input.fold(columns, options)
}

export const fold = stepVerbFactory(foldStep)

// it's much more complicated to preserve because arquero forces a drop internally.
// what we'll do is create a temporary join table with the source columns we want to keep,
// and put them back together after the fold.
// note that this may potentially result in the original columns being in a new location, but we'll try.
function preserve(input: ColumnTable, columns: string[], options: FoldOptions) {
	const key = '__datashaper_fold_source__'
	const originalIndex = input.columnIndex(columns[0] as any)
	const sources = input.select(columns).derive({ [key]: op.row_number() })
	const folded = input
		.derive({ [key]: op.row_number() })
		.fold(columns, options)
		.lookup(sources, key, columns)
		.select(not(key))
	const relocate = {
		[originalIndex === 0 ? 'before' : 'after']:
			folded.columnName(originalIndex),
	}
	// arquero typing is messed up here - string array and relocate object are valid params as is
	const relocated = folded.relocate(columns as any, relocate as any)
	return relocated
}
