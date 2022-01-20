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
	Impute,
	Join,
	Lookup,
	Orderby,
	Recode,
	Rename,
	Rollup,
	Sample,
	Select,
	SetOperation,
	NoParameters,
} from './verbs'

const compound: Record<string, React.FC<StepComponentProps>> = {
	'multi-binarize': CompoundBinarize,
	'filter-aggregate-lookup': FilterAggregateLookup,
}

const verb: Record<string, React.FC<StepComponentProps>> = {
	aggregate: Aggregate,
	bin: Bin,
	binarize: Binarize,
	concat: SetOperation,
	dedupe: ColumnListOperation,
	derive: Derive,
	difference: SetOperation,
	fill: Fill,
	filter: Filter,
	fold: ColumnListOperation,
	groupby: ColumnListOperation,
	intersect: SetOperation,
	impute: Impute,
	join: Join,
	lookup: Lookup,
	orderby: Orderby,
	recode: Recode,
	rename: Rename,
	rollup: Rollup,
	sample: Sample,
	select: Select,
	spread: ColumnListOperation,
	ungroup: NoParameters,
	union: SetOperation,
	unorder: NoParameters,
	unroll: ColumnListOperation,
}

const types = {
	compound,
	verb,
}

/**
 * Given a Step definition, returns the correct React component function.
 * @param step
 */
export function selectStepComponent(step: Step): React.FC<StepComponentProps> {
	return types[step.type][step.verb]
}
