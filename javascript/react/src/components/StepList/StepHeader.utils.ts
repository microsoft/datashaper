/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	DeriveArgs,
	InputColumnArgs,
	InputColumnListArgs,
	InputColumnRecordArgs,
	OrderbyArgs,
	OutputColumnArgs,
	PivotArgs,
	SampleArgs,
} from '@datashaper/schema'
import { Verb } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import {
	isInputColumnListStep,
	isInputColumnRecordStep,
	isInputColumnStep,
	isInputKeyValueStep,
	isInputTableListStep,
	isOutputColumnStep,
} from '@datashaper/workflow'
import { format } from 'd3-format'

/**
 * Create reasonable short detail text for a step.
 * For most this will be the column or columns operated on,
 * but we have a few special cases too.
 * @param step
 * @returns
 */
export function deriveDetails(step: Step): string | undefined {
	const { verb, args } = step

	// handle special case verbs first
	switch (verb) {
		case Verb.Derive:
			return `from ${(args as DeriveArgs).column1} & ${
				(args as DeriveArgs).column2
			}`
		case Verb.Orderby:
			return (args as OrderbyArgs).orders.map((o) => o.column).join(',')
		case Verb.Sample:
			return sample(step)
	}

	if (isInputColumnStep(step)) {
		return (args as InputColumnArgs).column
	} else if (isInputColumnListStep(step)) {
		return (args as InputColumnListArgs).columns.join(',')
	} else if (isInputColumnRecordStep(step)) {
		return Object.keys((args as InputColumnRecordArgs).columns).join(',')
	} else if (isInputKeyValueStep(step)) {
		return `${(args as PivotArgs).key} & ${(args as PivotArgs).value}`
	} else if (isOutputColumnStep(step)) {
		return (args as OutputColumnArgs).to
	} else if (isInputTableListStep(step)) {
		const others = step.input['other']
			? step.input['other'].node
			: step.input.others?.map((o) => o.node).join(',')
		return `with ${others}`
	}
}

const whole = format('d')

function sample(step: Step): string {
	const args = step.args as SampleArgs
	return args.proportion
		? `${whole(args.proportion * 100)}% of rows`
		: `${args.size} rows`
}
