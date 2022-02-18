/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { CompoundBinarize, FilterAggregateLookup } from './compounds/index.js'
import type { StepComponentProps } from './types.js'
import {
	Aggregate,
	Bin,
	Binarize,
	ColumnListOperation,
	Derive,
	Fill,
	Filter,
	Fold,
	Impute,
	Join,
	Lookup,
	Merge,
	Orderby,
	Pivot,
	Recode,
	Rename,
	Rollup,
	Sample,
	Select,
	SetOperation,
	Spread,
	NoParameters,
	Erase,
	Unfold,
} from './verbs/index.js'

const verb: Record<string, React.FC<StepComponentProps>> = {
	aggregate: Aggregate,
	bin: Bin,
	binarize: Binarize,
	concat: SetOperation,
	dedupe: ColumnListOperation,
	derive: Derive,
	difference: SetOperation,
	erase: Erase,
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
	select: Select,
	spread: Spread,
	unfold: Unfold,
	ungroup: NoParameters,
	union: SetOperation,
	unorder: NoParameters,
	unroll: ColumnListOperation,
	'multi-binarize': CompoundBinarize,
	'filter-aggregate-lookup': FilterAggregateLookup,
}

/**
 * Given a Step definition, returns the correct React component function.
 * @param step
 */
export function selectStepComponent(step: Step): React.FC<StepComponentProps> {
	const result = verb[step.verb]
	if (!result) {
		throw new Error(`verb ${step.verb} not found`)
	}
	return result
}
