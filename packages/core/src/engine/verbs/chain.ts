/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { StepFunction, TableStore } from '../../index.js'
import { ChainArgs, Step } from '../../types.js'

import { aggregate } from './aggregate.js'
import { bin } from './bin.js'
import { binarize } from './binarize.js'
import { concat } from './concat.js'
import { dedupe } from './dedupe.js'
import { derive } from './derive.js'
import { difference } from './difference.js'
import { fetch } from './fetch.js'
import { fill } from './fill.js'
import { filter } from './filter.js'
import { fold } from './fold.js'
import { groupby } from './groupby.js'
import { impute } from './impute.js'
import { intersect } from './intersect.js'
import { join } from './join.js'
import { lookup } from './lookup.js'
import { orderby } from './orderby.js'
import { recode } from './recode.js'
import { rename } from './rename.js'
import { rollup } from './rollup.js'
import { sample } from './sample.js'
import { select } from './select.js'
import { spread } from './spread.js'
import { ungroup } from './ungroup.js'
import { union } from './union.js'
import { unorder } from './unorder.js'
import { unroll } from './unroll.js'

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
