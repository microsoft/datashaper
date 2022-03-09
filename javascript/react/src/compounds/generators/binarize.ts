/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	BinarizeStep,
	ChainStep,
	DeriveStep,
	LookupStep,
	Step,
} from '@data-wrangling-components/core'
import { MathOperator, Verb } from '@data-wrangling-components/core'
import merge from 'lodash-es/merge.js'

const COLLECTOR = 'compound-binarize-collector-table'
const FINAL_OUTPUT = 'compound-binarize-final-output-table'
const COMBINED_COLUMN = 'combined'
const binarize = (index: number) => `binarize-${index}`
/*
	approach:
	- each binarize creates new column
		- input column for each should be the same
	- binarizes are then combined using serial derives
		- derive 0 + 1, 1 + 2, ...n + n1
	- one final binarize is used to convert summed derive column to binary
	- final lookup adds the original source + binarized "to" column together

	we can model this as a series of partitioned chains that each do one part of the step
	- binarize[]
	- derive[]
	- binarize
	- lookup
*/

export function defaults(step: Step): ChainStep {
	const merged = merge(
		{
			output: FINAL_OUTPUT,
		},
		{
			args: {
				steps: [
					{
						verb: Verb.Chain,
						input: step.input,
						output: COLLECTOR,
						args: {
							steps: [],
						},
					},
					{
						verb: Verb.Chain,
						input: COLLECTOR,
						output: COLLECTOR,
						args: {
							steps: [],
						},
					},
					{
						verb: Verb.Binarize,
						input: COLLECTOR,
						output: COLLECTOR,
						args: {
							column: COMBINED_COLUMN,
							operator: '>=',
							type: 'value',
							value: 1,
						},
					},
					{
						verb: Verb.Lookup,
						input: step.input,
						output: FINAL_OUTPUT,
						args: {
							other: COLLECTOR,
						},
					},
				],
			},
		},
		step,
	) as ChainStep
	return merged
}

export function createBinarize(
	parent: ChainStep,
	column: string | undefined,
): ChainStep {
	const update = merge({}, parent)
	const binarize = getBinarizeChain(update)
	const derive = getDeriveChain(update)
	const newStep = createNewBinarize(update, column)
	binarize.args.steps.push(newStep)
	derive.args.steps = makeDerives(binarize.args.steps as BinarizeStep[])
	return update
}

export function getBinarizeSteps(parent: ChainStep): BinarizeStep[] {
	return getBinarizeChain(parent).args.steps as BinarizeStep[]
}

export function getColumn(step: ChainStep): string {
	const steps = getBinarizeSteps(step)
	if (steps[0]) {
		return steps[0].args.column
	} else {
		throw new Error(`could not get step details ${step.verb}`)
	}
}

// when the column changes, make sure every binarize step gets the update
export function updateColumn(step: ChainStep, column: string): ChainStep {
	const update = merge({}, step)
	getBinarizeSteps(update).forEach(s => {
		s.args.column = column
	})
	const lookup = getLookupStep(update)
	lookup.input = step.input
	lookup.args.on = [column]
	return update
}

export function getTo(step: ChainStep): string {
	return getFinalBinarizeStep(step).args.to
}

export function updateTo(step: ChainStep, to: string): ChainStep {
	const update = merge({}, step)
	const finalBinarize = getFinalBinarizeStep(update)
	const lookup = getLookupStep(update)
	finalBinarize.args.to = to
	lookup.args.columns = [to]
	return update
}

export function updateBinarize(
	parent: ChainStep,
	step: BinarizeStep,
	index: number,
): ChainStep {
	const update = merge({}, parent)
	const steps = getBinarizeSteps(update)
	steps[index] = step
	return update
}

function createNewBinarize(
	parent: ChainStep,
	column: string | undefined,
): BinarizeStep {
	const criteria = getBinarizeSteps(parent)
	const index = criteria.length
	const input = index === 0 ? parent.input : COLLECTOR
	const newStep: Step = {
		verb: Verb.Binarize,
		input,
		output: COLLECTOR,
		args: {
			// first binarize writes to the combined column in case it is the only one
			// which would result in no derives to combine columns
			to: index === 0 ? COMBINED_COLUMN : binarize(index),
			column,
		},
	}
	return newStep as BinarizeStep
}

function makeDerives(steps: BinarizeStep[]): DeriveStep[] {
	const derives: Step[] = []
	for (let index = 0; index < steps.length; index++) {
		const column1 = COMBINED_COLUMN
		const column2 = index === 0 ? COMBINED_COLUMN : binarize(index)
		const derive: Step = {
			verb: Verb.Derive,
			input: COLLECTOR,
			output: COLLECTOR,
			args: {
				column1,
				column2,
				to: COMBINED_COLUMN,
				operator: MathOperator.Add,
			},
		}
		derives.push(derive)
	}
	return derives as DeriveStep[]
}

function getBinarizeChain(parent: ChainStep): ChainStep {
	return getChildStep(parent, 0) as ChainStep
}

function getDeriveChain(parent: ChainStep): ChainStep {
	return getChildStep(parent, 1) as ChainStep
}

function getFinalBinarizeStep(parent: ChainStep): BinarizeStep {
	return getChildStep(parent, 2) as BinarizeStep
}

function getLookupStep(parent: ChainStep): LookupStep {
	return getChildStep(parent, 3) as LookupStep
}

function getChildStep(parent: ChainStep, index: number): Step {
	const result = parent.args.steps[index]
	if (!result) {
		throw new Error(`could not find child step@${index}`)
	}
	return result
}
