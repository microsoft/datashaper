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
	Derive,
	Fill,
	Filter,
	Fold,
	Groupby,
	Join,
	Lookup,
	Orderby,
	Rename,
	Sample,
	Select,
	Spread,
	SetOperation,
	Unroll,
} from './verbs'

const compound: Record<string, React.FC<StepComponentProps>> = {
	binarize: CompoundBinarize,
	'filter-aggregate-lookup': FilterAggregateLookup,
}

const verb: Record<string, React.FC<StepComponentProps>> = {
	aggregate: Aggregate,
	bin: Bin,
	binarize: Binarize,
	concat: SetOperation,
	derive: Derive,
	except: SetOperation,
	fill: Fill,
	filter: Filter,
	fold: Fold,
	groupby: Groupby,
	intersect: SetOperation,
	join: Join,
	lookup: Lookup,
	orderby: Orderby,
	rename: Rename,
	sample: Sample,
	select: Select,
	spread: Spread,
	union: SetOperation,
	unroll: Unroll,
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
