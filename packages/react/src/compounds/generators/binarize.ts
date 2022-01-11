/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	BinarizeStep,
	CompoundBinarizeStep,
	DeriveStep,
	FilterCompareType,
	MathOperator,
	NumericComparisonOperator,
	SelectStep,
	Step,
	StepType,
} from '@data-wrangling-components/core'

// TODO: it may make sense to chain together a series of tables for each step
// instead of collecting in one reused table. This would allow the option for
// deeper inspection of each step by an advanced user.
const COLLECTOR = 'compound-binarize-collector-table'
const FINAL_OUTPUT = 'compound-binarize-final-output-table'
const COMBINED_COLUMN = 'combined'
const binarize = (index: number) => `binarize-${index}`

export function defaults(step: Step): CompoundBinarizeStep {
	// HACK: this is a typing workaround since output is not optional
	const merged = {
		to: 'output',
		steps: [],
		...step,
	}
	if (!merged.output) {
		merged.output = FINAL_OUTPUT
	}
	return merged
}

// extract only the binarize steps from the constructed workflow
// however, the last one is always added as a cleanup by our workflow, so ignore it
export function filter(parent: CompoundBinarizeStep): Step[] {
	const filtered = parent.steps.filter(s => s.verb === 'binarize')
	return filtered.slice(0, filtered.length - 1)
}

export function create(parent: CompoundBinarizeStep): CompoundBinarizeStep {
	const criteria = filter(parent)
	const newStep = createNewBinarize(parent, criteria)
	const merged = [...criteria, newStep]
	return workflow(parent, merged)
}

// any time a step changes, update the surrounding workflow
export function update(
	parent: CompoundBinarizeStep,
	step?: Step,
	index?: number,
): CompoundBinarizeStep {
	const criteria = filter(parent)
	if (step && index) {
		criteria[index] = step
	}
	return workflow(parent, criteria)
}

function workflow(
	parent: CompoundBinarizeStep,
	criteria: any[],
): CompoundBinarizeStep {
	const post = [
		...makeDerives(parent, criteria),
		makeCleanupBinarize(parent, criteria),
		makeOutputSelect(parent, criteria),
	]
	return {
		...parent,
		steps: [...criteria, ...post],
	}
}

function createNewBinarize(
	parent: CompoundBinarizeStep,
	criteria: Step[],
): BinarizeStep {
	const index = criteria.length
	const input = index === 0 ? parent.input : COLLECTOR
	const newStep: Step = {
		type: StepType.Verb,
		verb: 'binarize',
		input,
		output: COLLECTOR,
		args: {
			to: binarize(index),
		},
	}
	return newStep as BinarizeStep
}

function makeDerives(
	parent: CompoundBinarizeStep,
	steps: BinarizeStep[],
): DeriveStep[] {
	const derives: Step[] = []
	const first = steps[0]
	for (let index = 1; index < steps.length; index++) {
		const step = steps[index]
		const column1 = index > 1 ? parent.to : first.args.to
		const derive: Step = {
			type: StepType.Verb,
			verb: 'derive',
			input: COLLECTOR,
			output: COLLECTOR,
			args: {
				column1,
				column2: step.args.to,
				to: COMBINED_COLUMN,
				operator: MathOperator.Add,
			},
		}
		derives.push(derive)
	}
	return derives as DeriveStep[]
}

function makeOutputSelect(
	parent: CompoundBinarizeStep,
	derives: DeriveStep[],
): SelectStep {
	const not = [...derives.map(d => d.args.to), COMBINED_COLUMN]
	return {
		type: StepType.Verb,
		verb: 'select',
		input: COLLECTOR,
		output: parent.output,
		args: {
			columns: {},
			not,
		},
	}
}

function makeCleanupBinarize(
	parent: CompoundBinarizeStep,
	steps: Step[],
): BinarizeStep {
	const newStep: BinarizeStep = {
		type: StepType.Verb,
		verb: 'binarize',
		input: COLLECTOR,
		output: COLLECTOR,
		args: {
			column: steps.length === 1 ? binarize(0) : COMBINED_COLUMN,
			to: parent.to,
			type: FilterCompareType.Value,
			value: 0,
			operator: NumericComparisonOperator.Gt,
		},
	}
	return newStep
}
