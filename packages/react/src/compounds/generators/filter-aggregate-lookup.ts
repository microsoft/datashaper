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
} from '@data-wrangling-components/core'
import { merge } from 'lodash'

const FINAL_OUTPUT = 'filter-aggregate-lookup-final-output-table'

export function defaults(parent: Step) {
	const merged = merge(
		{
			output: FINAL_OUTPUT,
		},
		{
			steps: [
				defaultJoin(parent),
				defaultFilter(parent),
				defaultAggregate(parent),
				defaultLookup(parent),
			],
		},
		parent,
	)
	return merged
}

function mergeSteps(
	parent: Step,
	join: string,
	filter: string,
	aggregate: string,
	lookup: string,
) {
	return merge({}, parent, {
		steps: [join, filter, aggregate, lookup],
	})
}

export function updateAs(parent: any, as: string) {
	const [join, filter, aggregate, lookup] = parent.steps
	aggregate.args.as = as
	lookup.args.columns = [as]
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateIdentifierColumn(parent: any, column: string) {
	const [join, filter, aggregate, lookup] = parent.steps
	join.args.on = [column]
	aggregate.args.groupby = column
	lookup.args.on = [column]
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateLookupColumn(parent: any, column: string) {
	const [join, filter, aggregate, lookup] = parent.steps
	filter.args.column = column
	aggregate.args.field = column
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateLookupTable(parent: any, table: string) {
	const [join, filter, aggregate, lookup] = parent.steps
	join.args.other = table
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateFilter(parent: any, step: Step) {
	const [join, filter, aggregate, lookup] = parent.steps
	filter.args = step.args
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

export function updateAggregateOperation(parent: any, operation: string) {
	const [join, filter, aggregate, lookup] = parent.steps
	aggregate.args.operation = operation
	return mergeSteps(parent, join, filter, aggregate, lookup)
}

function defaultJoin(parent: Step) {
	const newStep: Step = {
		type: StepType.Verb,
		verb: 'join',
		input: parent.input,
		output: 'compound-join',
		args: {},
	}
	return newStep
}

function defaultFilter(parent: Step) {
	const newStep: Step = {
		type: StepType.Verb,
		verb: 'filter',
		input: 'compound-join',
		output: 'compound-filter',
		args: {},
	}
	return newStep
}

function defaultAggregate(parent: Step) {
	const newStep: Step = {
		type: StepType.Verb,
		verb: 'aggregate',
		input: 'compound-filter',
		output: 'compound-aggregate',
		args: {
			as: 'aggregate',
		},
	}
	return newStep
}

function defaultLookup(parent: Step) {
	const newStep: Step = {
		type: StepType.Verb,
		verb: 'lookup',
		input: parent.input,
		output: parent.output,
		args: {
			other: 'compound-aggregate',
			columns: ['aggregate'],
		},
	}
	return newStep
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
