/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'

import type { StepComponentProps } from './types.js'
import {
	Aggregate,
	Bin,
	Binarize,
	BooleanLogic,
	ColumnListOperation,
	Convert,
	Derive,
	Erase,
	Fetch,
	Fill,
	Filter,
	Fold,
	Impute,
	Join,
	Lookup,
	Merge,
	NoParameters,
	Orderby,
	Pivot,
	Recode,
	Rename,
	Rollup,
	Sample,
	SetOperation,
	Spread,
	Unfold,
	Window,
} from './verbs/index.js'

const verb: Record<string, React.FC<StepComponentProps>> = {
	aggregate: Aggregate,
	bin: Bin,
	binarize: Binarize,
	boolean: BooleanLogic,
	concat: SetOperation,
	convert: Convert,
	dedupe: ColumnListOperation,
	derive: Derive,
	difference: SetOperation,
	erase: Erase,
	fetch: Fetch,
	fill: Fill,
	filter: Filter,
	fold: Fold,
	groupby: ColumnListOperation,
	intersect: SetOperation,
	impute: Impute,
	join: Join,
	lookup: Lookup,
	merge: Merge,
	orderby: Orderby,
	pivot: Pivot,
	recode: Recode,
	rename: Rename,
	rollup: Rollup,
	sample: Sample,
	select: ColumnListOperation,
	spread: Spread,
	unfold: Unfold,
	ungroup: NoParameters,
	union: SetOperation,
	unorder: NoParameters,
	unroll: ColumnListOperation,
	window: Window,
}

/**
 * Given a Step definition, returns the correct React component function.
 * @param step -
 */
export function selectStepComponent(step: Step): React.FC<StepComponentProps> {
	const result = verb[step.verb]
	if (!result) {
		throw new Error(`verb ${step.verb} not found`)
	}
	return result
}
