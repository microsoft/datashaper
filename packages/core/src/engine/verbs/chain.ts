/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { StepFunction, TableStore } from '../..'
import { ChainArgs, Step } from '../../types'

import { aggregate } from './aggregate'
import { bin } from './bin'
import { binarize } from './binarize'
import { concat } from './concat'
import { dedupe } from './dedupe'
import { derive } from './derive'
import { difference } from './difference'
import { erase } from './erase'
import { fetch } from './fetch'
import { fill } from './fill'
import { filter } from './filter'
import { fold } from './fold'
import { groupby } from './groupby'
import { impute } from './impute'
import { intersect } from './intersect'
import { join } from './join'
import { lookup } from './lookup'
import { merge } from './merge'
import { orderby } from './orderby'
import { pivot } from './pivot'
import { recode } from './recode'
import { rename } from './rename'
import { rollup } from './rollup'
import { sample } from './sample'
import { select } from './select'
import { spread } from './spread'
import { unfold } from './unfold'
import { ungroup } from './ungroup'
import { union } from './union'
import { unorder } from './unorder'
import { unroll } from './unroll'

const verbs: Record<string, StepFunction> = {
	aggregate,
	bin,
	binarize,
	chain: exec,
	concat,
	dedupe,
	derive,
	difference,
	erase,
	fetch,
	fill,
	filter,
	fold,
	groupby,
	impute,
	intersect,
	join,
	lookup,
	merge,
	orderby,
	pivot,
	recode,
	rename,
	rollup,
	sample,
	select,
	spread,
	unfold,
	ungroup,
	union,
	unorder,
	unroll,
}

async function exec(step: Step, store: TableStore): Promise<ColumnTable> {
	const { args } = step
	const { steps, nofork } = args as ChainArgs

	const substore = nofork ? store : store.clone()

	let output: ColumnTable = table({})
	for (let index = 0; index < steps.length; index++) {
		const step = steps[index]
		const { verb } = step
		try {
			// fallback to chain if unspecified - this allows custom names to identify different chains
			const fn = verbs[verb] || exec
			// child store gets intermediate outputs so chain steps can do lookups
			output = await fn(step, substore)
			substore.set(step.output, output)
		} catch (e) {
			console.error(`Pipeline failed on step ${index}`, step)
			throw e
		}
	}
	// parent store only gets the final output of the chain
	store.set(step.output, output)
	// return the final table
	return output
}

/**
 * Executes a series of steps.
 * This is actually the core engine for executing pipelines.
 */
export async function chain(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	return exec(step, store)
}
