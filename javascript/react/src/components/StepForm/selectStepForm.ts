/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import get from 'lodash-es/get.js'

import {
	AggregateForm,
	BinarizeForm,
	BinForm,
	BooleanLogicForm,
	ConvertForm,
	DeriveForm,
	EncodeDecodeForm,
	EraseForm,
	FillForm,
	FilterForm,
	FoldForm,
	ImputeForm,
	JoinForm,
	LookupForm,
	MergeForm,
	PrintForm,
	NoParametersForm,
	OneHotForm,
	OrderbyForm,
	PivotForm,
	RecodeForm,
	RenameForm,
	RollupForm,
	SampleForm,
	SetOperationForm,
	SpreadForm,
	UnfoldForm,
	UnhotForm,
	WindowForm,
	WorkflowForm,
} from '../verbs/forms/index.js'
import type { StepFormProps } from '../verbs/index.js'
import { StringsReplaceForm } from '../verbs/forms/strings/StringsReplaceForm/StringsReplaceForm.js'

const forms = {
	aggregate: AggregateForm,
	bin: BinForm,
	binarize: BinarizeForm,
	boolean: BooleanLogicForm,
	concat: SetOperationForm,
	convert: ConvertForm,
	copy: NoParametersForm,
	dedupe: NoParametersForm,
	derive: DeriveForm,
	difference: SetOperationForm,
	decode: EncodeDecodeForm,
	drop: NoParametersForm,
	encode: EncodeDecodeForm,
	erase: EraseForm,
	fill: FillForm,
	filter: FilterForm,
	fold: FoldForm,
	groupby: NoParametersForm,
	intersect: SetOperationForm,
	impute: ImputeForm,
	join: JoinForm,
	lookup: LookupForm,
	merge: MergeForm,
	print: PrintForm,
	onehot: OneHotForm,
	orderby: OrderbyForm,
	pivot: PivotForm,
	recode: RecodeForm,
	rename: RenameForm,
	rollup: RollupForm,
	sample: SampleForm,
	select: NoParametersForm,
	spread: SpreadForm,
	strings: {
		replace: StringsReplaceForm,
		lower: NoParametersForm,
		upper: NoParametersForm,
	},
	unfold: UnfoldForm,
	ungroup: NoParametersForm,
	unhot: UnhotForm,
	union: SetOperationForm,
	unorder: NoParametersForm,
	unroll: NoParametersForm,
	window: WindowForm,
	workflow: WorkflowForm
}

/**
 * Given a Step definition, returns the correct React component function.
 * @param step -
 */
export function selectStepForm(
	step: Step<unknown>,
): React.FC<StepFormProps<unknown>> {
	const result: React.FC<StepFormProps<any>> | undefined = get(forms, step.verb)
	if (!result) {
		throw new Error(`verb ${step.verb} not found`)
	}
	return result
}
