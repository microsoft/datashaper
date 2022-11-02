/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'

import type { StepComponentProps } from '../../types.js'
import {
	Aggregate,
	Bin,
	Binarize,
	BooleanLogic,
	Convert,
	Derive,
	EncodeDecode,
	Erase,
	Fill,
	Filter,
	Fold,
	Impute,
	Join,
	Lookup,
	Merge,
	NoParameters,
	OneHot,
	Orderby,
	Pivot,
	Recode,
	Rename,
	Rollup,
	Sample,
	SetOperation,
	Spread,
	Unfold,
	Unhot,
	Window,
} from '../verbs/renderers/index.js'

const verb: Record<string, React.FC<StepComponentProps<any>>> = {
	aggregate: Aggregate,
	bin: Bin,
	binarize: Binarize,
	boolean: BooleanLogic,
	concat: SetOperation,
	convert: Convert,
	dedupe: NoParameters,
	derive: Derive,
	difference: SetOperation,
	decode: EncodeDecode,
	encode: EncodeDecode,
	erase: Erase,
	fill: Fill,
	filter: Filter,
	fold: Fold,
	groupby: NoParameters,
	intersect: SetOperation,
	impute: Impute,
	join: Join,
	lookup: Lookup,
	merge: Merge,
	onehot: OneHot,
	orderby: Orderby,
	pivot: Pivot,
	recode: Recode,
	rename: Rename,
	rollup: Rollup,
	sample: Sample,
	select: NoParameters,
	spread: Spread,
	unfold: Unfold,
	ungroup: NoParameters,
	unhot: Unhot,
	union: SetOperation,
	unorder: NoParameters,
	unroll: NoParameters,
	window: Window,
}

/**
 * Given a Step definition, returns the correct React component function.
 * @param step -
 */
export function selectStepComponent(
	step: Step<unknown>,
): React.FC<StepComponentProps<unknown>> {
	const result = verb[step.verb]
	if (!result) {
		throw new Error(`verb ${step.verb} not found`)
	}
	return result
}
