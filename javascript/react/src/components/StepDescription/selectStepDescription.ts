/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'

import {
	AggregateDescription,
	BinarizeDescription,
	BinDescription,
	BooleanLogicDescription,
	ConvertDescription,
	CopyDescription,
	DeriveDescription,
	EncodeDecodeDescription,
	EraseDescription,
	FillDescription,
	FilterDescription,
	FoldDescription,
	ImputeDescription,
	JoinDescription,
	LookupDescription,
	MergeDescription,
	NoParametersDescription,
	OneHotDescription,
	OrderbyDescription,
	PivotDescription,
	RecodeDescription,
	RenameDescription,
	RollupDescription,
	SampleDescription,
	SetOperationDescription,
	SpreadDescription,
	UnfoldDescription,
	UnhotDescription,
	WindowDescription,
} from '../verbs/descriptions/index.js'
import type { StepDescriptionProps } from '../verbs/index.js'

const descriptions: Record<string, React.FC<StepDescriptionProps<any>>> = {
	aggregate: AggregateDescription,
	bin: BinDescription,
	binarize: BinarizeDescription,
	boolean: BooleanLogicDescription,
	concat: SetOperationDescription,
	convert: ConvertDescription,
	copy: CopyDescription,
	dedupe: NoParametersDescription,
	derive: DeriveDescription,
	difference: SetOperationDescription,
	decode: EncodeDecodeDescription,
	drop: NoParametersDescription,
	encode: EncodeDecodeDescription,
	erase: EraseDescription,
	fill: FillDescription,
	filter: FilterDescription,
	fold: FoldDescription,
	groupby: NoParametersDescription,
	impute: ImputeDescription,
	intersect: SetOperationDescription,
	join: JoinDescription,
	lookup: LookupDescription,
	merge: MergeDescription,
	onehot: OneHotDescription,
	orderby: OrderbyDescription,
	pivot: PivotDescription,
	recode: RecodeDescription,
	rename: RenameDescription,
	rollup: RollupDescription,
	sample: SampleDescription,
	select: NoParametersDescription,
	spread: SpreadDescription,
	unfold: UnfoldDescription,
	ungroup: NoParametersDescription,
	unhot: UnhotDescription,
	union: SetOperationDescription,
	unorder: NoParametersDescription,
	unroll: NoParametersDescription,
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
