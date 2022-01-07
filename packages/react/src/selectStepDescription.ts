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
	JoinDescription,
	LookupDescription,
	OrderbyDescription,
	RecodeDescription,
	RenameDescription,
	SampleDescription,
	SelectDescription,
	SetOperationDescription,
} from './verbs'

const descriptions: Record<string, React.FC<StepDescriptionProps>> = {
	aggregate: AggregateDescription,
	bin: BinDescription,
	binarize: BinarizeDescription,
	concat: SetOperationDescription,
	derive: DeriveDescription,
	except: SetOperationDescription,
	fill: FillDescription,
	filter: FilterDescription,
	fold: ColumnListOperationDescription,
	groupby: ColumnListOperationDescription,
	intersect: SetOperationDescription,
	join: JoinDescription,
	lookup: LookupDescription,
	orderby: OrderbyDescription,
	recode: RecodeDescription,
	rename: RenameDescription,
	sample: SampleDescription,
	select: SelectDescription,
	spread: ColumnListOperationDescription,
	union: SetOperationDescription,
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
