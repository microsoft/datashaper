/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { Step, StepFunction, StepType, Verb } from '../../types'

import { aggregate } from './aggregate'
import { binarize } from './binarize'
import { concat } from './concat'
import { derive } from './derive'
import { except } from './except'
import { fill } from './fill'
import { filter } from './filter'
import { fold } from './fold'
import { groupby } from './groupby'
import { intersect } from './intersect'
import { join } from './join'
import { lookup } from './lookup'
import { orderby } from './orderby'
import { rename } from './rename'
import { sample } from './sample'
import { select } from './select'
import { spread } from './spread'
import { union } from './union'
import { unroll } from './unroll'

const verbs: Record<string, StepFunction> = {
	aggregate,
	binarize,
	concat,
	derive,
	except,
	fill,
	filter,
	fold,
	groupby,
	intersect,
	join,
	lookup,
	orderby,
	rename,
	sample,
	select,
	spread,
	union,
	unroll,
}

export async function verb(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
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
	verb: string,
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
		case Verb.Aggregate:
		case Verb.Binarize:
		case Verb.Derive:
		case Verb.Fill:
			return {
				...base,
				args: {
					as: 'output',
				},
			}
		case Verb.Concat:
		case Verb.Except:
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
					as: ['key', 'value'],
					columns: [],
				},
			}
		case Verb.Lookup:
		case Verb.Groupby:
		case Verb.Spread:
		case Verb.Unroll:
			return {
				...base,
				args: {
					columns: [],
				},
			}
		case Verb.Filter:
		case Verb.Join:
		case Verb.Orderby:
		case Verb.Rename:
		case Verb.Sample:
		case Verb.Select:
	}
	return {
		...base,
		args: {},
	}
}
