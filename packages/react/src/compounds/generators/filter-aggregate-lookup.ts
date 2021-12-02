/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	AggregateStep,
	CompoundStep,
	FilterStep,
	JoinStep,
	LookupStep,
	Step,
	StepType,
	FieldAggregateOperation,
	JoinArgs,
	FilterArgs,
	AggregateArgs,
} from '@data-wrangling-components/core'

const FINAL_OUTPUT = 'filter-aggregate-lookup-final-output-table'

export type StepChain = Step & {
	output: string
	steps: [JoinStep, FilterStep, AggregateStep, LookupStep]
}

export function defaults(parent: Step): StepChain {
	return {
		...parent,
		output: FINAL_OUTPUT,
		steps: [
			defaultJoin(parent),
			defaultFilter(parent),
			defaultAggregate(parent),
			defaultLookup(parent),
		],
	}
}

function mergeSteps(
	parent: StepChain,
	join: JoinStep,
	filter: FilterStep,
	aggregate: AggregateStep,
	lookup: LookupStep,
): StepChain {
	return { ...parent, steps: [join, filter, aggregate, lookup] }
}

export function updateAs(parent: StepChain, as: string): StepChain {
	const [join, filter, aggregate, lookup] = parent.steps
	aggregate.args.as = as
	lookup.args.columns = [as]
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateIdentifierColumn(
	parent: StepChain,
	column: string,
): StepChain {
	const [join, filter, aggregate, lookup] = parent.steps
	join.args.on = [column]
	aggregate.args.groupby = column
	lookup.args.on = [column]
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateLookupColumn(
	parent: StepChain,
	column: string,
): StepChain {
	const [join, filter, aggregate, lookup] = parent.steps
	filter.args.column = column
	aggregate.args.field = column
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateLookupTable(parent: StepChain, table: string): StepChain {
	const [join, filter, aggregate, lookup] = parent.steps
	join.args.other = table
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateFilter(parent: StepChain, step: FilterStep): StepChain {
	const [join, filter, aggregate, lookup] = parent.steps
	filter.args = step.args
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateAggregateOperation(
	parent: StepChain,
	operation: FieldAggregateOperation,
): StepChain {
	const [join, filter, aggregate, lookup] = parent.steps
	aggregate.args.operation = operation
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

function defaultJoin(parent: Step): JoinStep {
	return {
		type: StepType.Verb,
		verb: 'join',
		input: parent.input,
		output: 'compound-join',
		args: {} as JoinArgs,
	}
}

function defaultFilter(_parent: Step): FilterStep {
	return {
		type: StepType.Verb,
		verb: 'filter',
		input: 'compound-join',
		output: 'compound-filter',
		args: {} as FilterArgs,
	}
}

function defaultAggregate(_parent: Step): AggregateStep {
	return {
		type: StepType.Verb,
		verb: 'aggregate',
		input: 'compound-filter',
		output: 'compound-aggregate',
		args: {
			as: 'aggregate',
		} as AggregateArgs,
	}
}

function defaultLookup(parent: Step): LookupStep {
	return {
		type: StepType.Verb,
		verb: 'lookup',
		input: parent.input,
		output: parent.output,
		args: {
			other: 'compound-aggregate',
			columns: ['aggregate'],
		},
	}
}

export function getJoin(step: CompoundStep): JoinStep {
	return pickStep(step, 0) as JoinStep
}

export function getFilter(step: CompoundStep): FilterStep {
	return pickStep(step, 1) as FilterStep
}

export function getAggregate(step: CompoundStep): AggregateStep {
	return pickStep(step, 2) as AggregateStep
}

export function getLookup(step: CompoundStep): LookupStep {
	return pickStep(step, 3) as LookupStep
}

function pickStep(step: CompoundStep, index: number) {
	if (step.steps.length > 0) {
		return step.steps[index]
	}
}
