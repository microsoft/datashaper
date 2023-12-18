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
		verbs: [Verb.Pivot, Verb.Rollup, Verb.Unroll, Verb.Window],
	},
	{
		label: 'Transforms',
		verbs: [
			Verb.Convert,
			Verb.Copy,
			Verb.Erase,
			Verb.Fill,
			Verb.Impute,
			Verb.Onehot,
			Verb.Spread,
			Verb.Recode,
			Verb.StringsReplace,
			Verb.StringsLower,
			Verb.StringsUpper,
		],
	},
]

export const groupedTableVerbs: GroupedVerbs[] = [
	{
		label: 'Combine columns',
		alwaysEnabled: true,
		verbs: [
			Verb.Boolean,
			Verb.Derive,
			Verb.Fold,
			Verb.Unfold,
			Verb.Merge,
			Verb.Unhot,
			Verb.Rename,
		],
	},
	{
		label: 'Combine tables',
		verbs: [
			Verb.Concat,
			Verb.Dedupe,
			Verb.Difference,
			Verb.Intersect,
			Verb.Union,
		],
	},
	{
		label: 'Transform table',
		alwaysEnabled: true,
		verbs: [
			Verb.Decode,
			Verb.Encode,
			Verb.Groupby,
			Verb.Ungroup,
			Verb.Orderby,
			Verb.Unorder,
			Verb.Sample,
			Verb.Select,
			Verb.Drop,
		],
	},
]
