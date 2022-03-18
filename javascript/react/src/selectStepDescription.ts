/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'

import type { StepDescriptionProps } from './types.js'
import {
	AggregateDescription,
	BinarizeDescription,
	BinDescription,
	ColumnListOperationDescription,
	ConvertDescription,
	DeriveDescription,
	EraseDescription,
	FetchDescription,
	FillDescription,
	FilterDescription,
	FoldDescription,
	ImputeDescription,
	JoinDescription,
	LookupDescription,
	MergeDescription,
	NoParametersDescription,
	OrderbyDescription,
	PivotDescription,
	RecodeDescription,
	RenameDescription,
	RollupDescription,
	SampleDescription,
	SetOperationDescription,
	SpreadDescription,
	UnfoldDescription,
	WindowDescription,
} from './verbs/index.js'

const descriptions: Record<string, React.FC<StepDescriptionProps>> = {
	aggregate: AggregateDescription,
	bin: BinDescription,
	binarize: BinarizeDescription,
	concat: SetOperationDescription,
	convert: ConvertDescription,
	dedupe: ColumnListOperationDescription,
	derive: DeriveDescription,
	difference: SetOperationDescription,
	erase: EraseDescription,
	fetch: FetchDescription,
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
	select: ColumnListOperationDescription,
	spread: SpreadDescription,
	unfold: UnfoldDescription,
	ungroup: NoParametersDescription,
	union: SetOperationDescription,
	unorder: NoParametersDescription,
	unroll: ColumnListOperationDescription,
	window: WindowDescription,
}

/**
 * Given a Step definition, returns the correct React Description component function.
 * This is essentially a compact read-only description of the step parameters
 * @param step -
 */
export function selectStepDescription(
	step: Step,
): React.FC<StepDescriptionProps> {
	const result = descriptions[step.verb]
	if (!result) {
		throw new Error(`could not find step with verb ${step?.verb}`)
	}
	return result
}
