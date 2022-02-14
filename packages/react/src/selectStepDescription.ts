/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import React from 'react'
import { StepDescriptionProps } from './types'
import {
	AggregateDescription,
	BinDescription,
	BinarizeDescription,
	ColumnListOperationDescription,
	DeriveDescription,
	FillDescription,
	FilterDescription,
	ImputeDescription,
	JoinDescription,
	LookupDescription,
	OrderbyDescription,
	RecodeDescription,
	RenameDescription,
	RollupDescription,
	SampleDescription,
	SelectDescription,
	SetOperationDescription,
	NoParametersDescription,
} from './verbs'

const descriptions: Record<string, React.FC<StepDescriptionProps>> = {
	aggregate: AggregateDescription,
	bin: BinDescription,
	binarize: BinarizeDescription,
	concat: SetOperationDescription,
	dedupe: ColumnListOperationDescription,
	derive: DeriveDescription,
	difference: SetOperationDescription,
	fill: FillDescription,
	filter: FilterDescription,
	fold: ColumnListOperationDescription,
	groupby: ColumnListOperationDescription,
	impute: ImputeDescription,
	intersect: SetOperationDescription,
	join: JoinDescription,
	lookup: LookupDescription,
	orderby: OrderbyDescription,
	recode: RecodeDescription,
	rename: RenameDescription,
	rollup: RollupDescription,
	sample: SampleDescription,
	select: SelectDescription,
	spread: ColumnListOperationDescription,
	ungroup: NoParametersDescription,
	union: SetOperationDescription,
	unorder: NoParametersDescription,
	unroll: ColumnListOperationDescription,
}

/**
 * Given a Step definition, returns the correct React Description component function.
 * This is essentially a compact read-only description of the step parameters
 * @param step
 */
export function selectStepDescription(
	step: Step,
): React.FC<StepDescriptionProps> {
	return descriptions[step.verb]
}
