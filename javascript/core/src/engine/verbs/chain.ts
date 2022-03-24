/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'

import type { StepFunction, TableStore } from '../../index.js'
import type { ChainStep, TableContainer } from '../../types.js'
import { aggregate } from './aggregate.js'
import { bin } from './bin.js'
import { binarize } from './binarize.js'
import { boolean } from './boolean.js'
import { concat } from './concat.js'
import { convert } from './convert.js'
import { dedupe } from './dedupe.js'
import { derive } from './derive.js'
import { difference } from './difference.js'
import { erase } from './erase.js'
import { fetch } from './fetch.js'
import { fill } from './fill.js'
import { filter } from './filter.js'
import { fold } from './fold.js'
import { groupby } from './groupby.js'
import { impute } from './impute.js'
import { intersect } from './intersect.js'
import { join } from './join.js'
import { lookup } from './lookup.js'
import { merge } from './merge.js'
import { orderby } from './orderby.js'
import { pivot } from './pivot.js'
import { recode } from './recode.js'
import { rename } from './rename.js'
import { rollup } from './rollup.js'
import { sample } from './sample.js'
import { select } from './select.js'
import { spread } from './spread.js'
import { unfold } from './unfold.js'
import { ungroup } from './ungroup.js'
import { union } from './union.js'
import { unorder } from './unorder.js'
import { unroll } from './unroll.js'
import { window } from './window.js'

const verbs: Record<string, StepFunction<any>> = {
	aggregate,
	bin,
	binarize,
	boolean,
	chain: exec,
	concat,
	convert,
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
	window,
}

async function exec(
	step: ChainStep,
	store: TableStore,
): Promise<TableContainer> {
	const {
		args: { steps, nofork },
	} = step

	const substore = nofork ? store : await store.clone()

	let output: TableContainer = {
		id: step.output,
		table: table({}),
	}

	for (let index = 0; index < steps.length; index++) {
		const step = steps[index]!
		const { verb } = step
		try {
			// fallback to chain if unspecified - this allows custom names to identify different chains
			const fn: StepFunction<unknown> =
				verbs[verb] || (exec as StepFunction<any>)
			// child store gets intermediate outputs so chain steps can do lookups
			output = await fn(step, substore)
			substore.set(output)
		} catch (e) {
			console.error(`Pipeline failed on step ${index}`, step)
			throw e
		}
	}
	// parent store only gets the final output of the chain
	const final = {
		...output,
		id: step.output,
	}
	store.set(final)
	// return the final table
	return final
}

/**
 * Executes a series of steps.
 * This is actually the core engine for executing pipelines.
 */
export async function chain(
	step: ChainStep,
	store: TableStore,
): Promise<TableContainer> {
	return exec(step, store)
}
