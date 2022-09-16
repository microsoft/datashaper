/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Verb } from '@datashaper/schema'

import type { GroupedVerbs } from './TableCommands.types.js'

export const mainColumnVerbs = [
	Verb.Bin,
	Verb.Binarize,
	Verb.Filter,
	Verb.Aggregate,
]
export const mainTableVerbs = [Verb.Join, Verb.Lookup]

export const groupedColumnVerbs: GroupedVerbs[] = [
	{
		label: 'Aggregates',
		verbs: ['pivot', 'rollup', 'unroll', 'window'],
	},
	{
		label: 'Transforms',
		verbs: ['convert', 'erase', 'fill', 'impute', 'onehot', 'spread', 'recode'],
	},
]

export const groupedTableVerbs: GroupedVerbs[] = [
	{
		label: 'Combine columns',
		alwaysEnabled: true,
		verbs: ['boolean', 'derive', 'fold', 'unfold', 'merge', 'unhot', 'rename'],
	},
	{
		label: 'Combine tables',
		verbs: ['concat', 'dedupe', 'difference', 'intersect', 'union'],
	},
	{
		label: 'Transform table',
		alwaysEnabled: true,
		verbs: ['groupby', 'ungroup', 'orderby', 'unorder', 'sample', 'select'],
	},
]
