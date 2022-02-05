/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import React from 'react'
import { CompoundBinarize, FilterAggregateLookup } from './compounds'
import { StepComponentProps } from './types'
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
	NoParameters,
	Erase,
	Unfold,
} from './verbs'

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
	spread: ColumnListOperation,
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
	return verb[step.verb]
}
