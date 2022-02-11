/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	AggregateStep,
	ChainStep,
	FilterStep,
	JoinStep,
	LookupStep,
	Step,
	Verb,
	FieldAggregateOperation,
	JoinArgs,
	FilterArgs,
	AggregateArgs,
} from '@data-wrangling-components/core'
import merge from 'lodash/merge.js'

const FINAL_OUTPUT = 'filter-aggregate-lookup-final-output-table'

export function defaults(parent: Step): ChainStep {
	return merge({}, parent, {
		output: FINAL_OUTPUT,
		args: {
			steps: [
				defaultJoin(parent),
				defaultFilter(parent),
				defaultAggregate(parent),
				defaultLookup(parent),
			],
		},
	})
}

function mergeSteps(
	parent: ChainStep,
	join: JoinStep,
	filter: FilterStep,
	aggregate: AggregateStep,
	lookup: LookupStep,
): ChainStep {
	return {
		...parent,
		args: {
			steps: [join, filter, aggregate, lookup],
		},
	}
}

export function updateTo(parent: ChainStep, to: string): ChainStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	aggregate.args.to = to
	lookup.args.columns = [to]
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateIdentifierColumn(
	parent: ChainStep,
	column: string,
): ChainStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	join.args.on = [column]
	aggregate.args.groupby = column
	lookup.args.on = [column]
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateLookupColumn(
	parent: ChainStep,
	column: string,
): ChainStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	filter.args.column = column
	aggregate.args.column = column
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateLookupTable(parent: ChainStep, table: string): ChainStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	join.args.other = table
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateFilter(parent: ChainStep, step: FilterStep): ChainStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	filter.args = step.args
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateAggregateOperation(
	parent: ChainStep,
	operation: FieldAggregateOperation,
): ChainStep {
	const [join, filter, aggregate, lookup] = getSteps(parent)
	aggregate.args.operation = operation
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

function defaultJoin(parent: Step): JoinStep {
	return {
		verb: Verb.Join,
		input: parent.input,
		output: 'compound-join',
		args: {} as JoinArgs,
	}
}

function defaultFilter(_parent: Step): FilterStep {
	return {
		verb: Verb.Filter,
		input: 'compound-join',
		output: 'compound-filter',
		args: {} as FilterArgs,
	}
}

function defaultAggregate(_parent: Step): AggregateStep {
	return {
		verb: Verb.Aggregate,
		input: 'compound-filter',
		output: 'compound-aggregate',
		args: {} as AggregateArgs,
	}
}

function defaultLookup(parent: Step): LookupStep {
	return {
		verb: Verb.Lookup,
		input: parent.input,
		output: parent.output,
		args: {
			other: 'compound-aggregate',
			columns: [],
		},
	}
}

function getSteps(
	step: ChainStep,
): [JoinStep, FilterStep, AggregateStep, LookupStep] {
	const join = getJoin(step)
	const aggregate = getAggregate(step)
	const lookup = getLookup(step)
	const filter = getFilter(step)
	return [join, filter, aggregate, lookup]
}

export function getJoin(step: ChainStep): JoinStep {
	return pickStep(step, 0) as JoinStep
}

export function getFilter(step: ChainStep): FilterStep {
	return pickStep(step, 1) as FilterStep
}

export function getAggregate(step: ChainStep): AggregateStep {
	return pickStep(step, 2) as AggregateStep
}

export function getLookup(step: ChainStep): LookupStep {
	return pickStep(step, 3) as LookupStep
}

function pickStep(step: ChainStep, index: number) {
	if (step.args.steps.length > 0) {
		return step.args.steps[index]
	}
}
