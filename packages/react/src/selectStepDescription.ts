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
	EraseDescription,
	FillDescription,
	FilterDescription,
	FoldDescription,
	ImputeDescription,
	JoinDescription,
	LookupDescription,
	MergeDescription,
	OrderbyDescription,
	PivotDescription,
	RecodeDescription,
	RenameDescription,
	RollupDescription,
	SampleDescription,
	SelectDescription,
	SpreadDescription,
	SetOperationDescription,
	NoParametersDescription,
	UnfoldDescription,
} from './verbs'

const descriptions: Record<string, React.FC<StepDescriptionProps>> = {
	aggregate: AggregateDescription,
	bin: BinDescription,
	binarize: BinarizeDescription,
	concat: SetOperationDescription,
	dedupe: ColumnListOperationDescription,
	derive: DeriveDescription,
	difference: SetOperationDescription,
	erase: EraseDescription,
	fill: FillDescription,
	filter: FilterDescription,
	fold: FoldDescription,
	groupby: ColumnListOperationDescription,
	impute: ImputeDescription,
	intersect: SetOperationDescription,
	join: JoinDescription,
	lookup: LookupDescription,
	merge: MergeDescription,
	orderby: OrderbyDescription,
	pivot: PivotDescription,
	recode: RecodeDescription,
	rename: RenameDescription,
	rollup: RollupDescription,
	sample: SampleDescription,
	select: SelectDescription,
	spread: SpreadDescription,
	unfold: UnfoldDescription,
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
