/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import aggregate from './aggregate.js'
import bin from './bin.js'
import binarize from './binarize.js'
import chain from './chain.js'
import concat from './concat.js'
import dedupe from './dedupe.js'
import derive from './derive.js'
import difference from './difference.js'
import erase from './erase.js'
import _fetch from './fetch.js'
import fill from './fill.js'
import filter from './filter.js'
import fold from './fold.js'
import groupby from './groupby.js'
import impute from './impute.js'
import intersect from './intersect.js'
import join from './join.js'
import lookup from './lookup.js'
import merge from './merge.js'
import orderby from './orderby.js'
import pivot from './pivot.js'
import recode from './recode.js'
import rename from './rename.js'
import rollup from './rollup.js'
import sample from './sample.js'
import select from './select.js'
import spread from './spread.js'
import unfold from './unfold.js'
import ungroup from './ungroup.js'
import union from './union.js'
import unorder from './unorder.js'
import unroll from './unroll.js'

export const index = {
	aggregate: aggregate,
	bin: bin,
	binarize: binarize,
	chain: chain,
	concat: concat,
	dedupe: dedupe,
	derive: derive,
	difference: difference,
	erase: erase,
	fetch: _fetch,
	fill: fill,
	filter: filter,
	fold: fold,
	groupby: groupby,
	impute: impute,
	intersect: intersect,
	join: join,
	lookup: lookup,
	merge: merge,
	orderby: orderby,
	pivot: pivot,
	recode: recode,
	rename: rename,
	rollup: rollup,
	sample: sample,
	select: select,
	spread: spread,
	unfold: unfold,
	ungroup: ungroup,
	union: union,
	unorder: unorder,
	unroll: unroll,
}
