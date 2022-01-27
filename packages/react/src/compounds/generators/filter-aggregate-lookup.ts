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
	Verb,
	FieldAggregateOperation,
	JoinArgs,
	FilterArgs,
	AggregateArgs,
} from '@data-wrangling-components/core'
import { merge } from 'lodash'

const FINAL_OUTPUT = 'filter-aggregate-lookup-final-output-table'

export function defaults(parent: Step): CompoundStep {
	return merge({}, parent, {
		output: FINAL_OUTPUT,
		steps: [
			defaultJoin(parent),
			defaultFilter(parent),
			defaultAggregate(parent),
			defaultLookup(parent),
		],
	})
}

function mergeSteps(
	parent: CompoundStep,
	join: JoinStep,
	filter: FilterStep,
	aggregate: AggregateStep,
	lookup: LookupStep,
): CompoundStep {
	return { ...parent, steps: [join, filter, aggregate, lookup] }
}

export function updateAs(parent: CompoundStep, to: string): CompoundStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	aggregate.args.to = to
	lookup.args.columns = [to]
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateIdentifierColumn(
	parent: CompoundStep,
	column: string,
): CompoundStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	join.args.on = [column]
	aggregate.args.groupby = column
	lookup.args.on = [column]
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateLookupColumn(
	parent: CompoundStep,
	column: string,
): CompoundStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	filter.args.column = column
	aggregate.args.column = column
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateLookupTable(
	parent: CompoundStep,
	table: string,
): CompoundStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	join.args.other = table
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateFilter(
	parent: CompoundStep,
	step: FilterStep,
): CompoundStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	filter.args = step.args
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateAggregateOperation(
	parent: CompoundStep,
	operation: FieldAggregateOperation,
): CompoundStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	aggregate.args.operation = operation
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

function defaultJoin(parent: Step): JoinStep {
	return {
		type: StepType.Verb,
		verb: Verb.Join,
		input: parent.input,
		output: 'compound-join',
		args: {} as JoinArgs,
	}
}

function defaultFilter(_parent: Step): FilterStep {
	return {
		type: StepType.Verb,
		verb: Verb.Filter,
		input: 'compound-join',
		output: 'compound-filter',
		args: {} as FilterArgs,
	}
}

function defaultAggregate(_parent: Step): AggregateStep {
	return {
		type: StepType.Verb,
		verb: Verb.Aggregate,
		input: 'compound-filter',
		output: 'compound-aggregate',
		args: {
			to: 'aggregate',
		} as AggregateArgs,
	}
}

function defaultLookup(parent: Step): LookupStep {
	return {
		type: StepType.Verb,
		verb: Verb.Lookup,
		input: parent.input,
		output: parent.output,
		args: {
			other: 'compound-aggregate',
			columns: ['aggregate'],
		},
	}
}

function getSteps(
	step: CompoundStep,
): [JoinStep, FilterStep, AggregateStep, LookupStep] {
	const join = getJoin(step)
	const aggregate = getAggregate(step)
	const lookup = getLookup(step)
	const filter = getFilter(step)
	return [join, filter, aggregate, lookup]
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
