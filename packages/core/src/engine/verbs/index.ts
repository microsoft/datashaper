/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { BinStrategy, TableStore } from '../..'
import { Step, StepFunction, StepType, Verb } from '../../types'

import { aggregate } from './aggregate'
import { bin } from './bin'
import { binarize } from './binarize'
import { concat } from './concat'
import { dedupe } from './dedupe'
import { derive } from './derive'
import { difference } from './difference'
import { fetch } from './fetch'
import { fill } from './fill'
import { filter } from './filter'
import { fold } from './fold'
import { groupby } from './groupby'
import { impute } from './impute'
import { intersect } from './intersect'
import { join } from './join'
import { lookup } from './lookup'
import { orderby } from './orderby'
import { recode } from './recode'
import { rename } from './rename'
import { rollup } from './rollup'
import { sample } from './sample'
import { select } from './select'
import { spread } from './spread'
import { ungroup } from './ungroup'
import { union } from './union'
import { unorder } from './unorder'
import { unroll } from './unroll'

const verbs: Record<string, StepFunction> = {
	aggregate,
	bin,
	binarize,
	concat,
	dedupe,
	derive,
	difference,
	fetch,
	fill,
	filter,
	fold,
	groupby,
	impute,
	intersect,
	join,
	lookup,
	orderby,
	recode,
	rename,
	rollup,
	sample,
	select,
	spread,
	ungroup,
	union,
	unorder,
	unroll,
}

export async function verb(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	return verbs[step.verb](step, store)
}

/**
 * Factory function to create new verb configs
 * with as many reasonable defaults as possible.
 * TODO: if we accepted a table (or TableStore) we could do column lookups and such
 * to preselect.
 * @param verb
 */
export function factory(
	type: StepType,
	verb: Verb,
	input: string,
	output: string,
): Step {
	const base = {
		type,
		verb,
		input,
		output,
	}
	switch (verb) {
		case Verb.Bin:
			return {
				...base,
				args: {
					to: 'output',
					strategy: BinStrategy.Auto,
					fixedcount: 10,
				},
			}
		case Verb.Aggregate:
		case Verb.Binarize:
		case Verb.Derive:
		case Verb.Impute:
		case Verb.Fill:
		case Verb.Rollup:
			return {
				...base,
				args: {
					to: 'output',
				},
			}
		case Verb.Concat:
		case Verb.Difference:
		case Verb.Intersect:
		case Verb.Union:
			return {
				...base,
				args: {
					others: [],
				},
			}
		case Verb.Fold:
			return {
				...base,
				args: {
					to: ['key', 'value'],
					columns: [],
				},
			}
		case Verb.Lookup:
		case Verb.Groupby:
		case Verb.Dedupe:
		case Verb.Spread:
		case Verb.Unroll:
			return {
				...base,
				args: {
					columns: [],
				},
			}
		case Verb.Fetch:
		case Verb.Filter:
		case Verb.Join:
		case Verb.Orderby:
		case Verb.Rename:
		case Verb.Sample:
		case Verb.Select:
		case Verb.Ungroup:
		case Verb.Unorder:
	}
	return {
		...base,
		args: {},
	}
}
