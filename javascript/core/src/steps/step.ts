/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { v4 as uuid } from 'uuid'

import type {
	InputBinding,
	InputSpecification,
	StepCommon,
} from '../specification.js'
import {
	BinStrategy,
	BooleanOperator,
	FieldAggregateOperation,
	JoinStrategy,
	Verb,
} from '../verbs/index.js'

export interface StepInput<T extends object = any> extends StepCommon {
	/**
	 * The verb being executed
	 */
	verb: Verb

	/**
	 * The verb arguments
	 */
	args?: T

	/**
	 * The bound inputs
	 * Key = Input Socket Name
	 * Value = Socket Binding to other node
	 */
	input?:
		| string
		| ({
				others?: InputSpecification[]
		  } & Record<string, InputSpecification>)

	/**
	 * The observed outputs to record.
	 * Key = output socket name
	 * Value = store table name
	 */
	output: string | Record<string, string>
}

export interface Step<T extends object = any> {
	/**
	 * A unique identifier for this step
	 */
	id: string

	/**
	 * The verb being executed
	 */
	verb: Verb

	/**
	 * The verb arguments
	 */
	args: T

	/**
	 * The bound inputs
	 * Key = Input Socket Name
	 * Value = Socket Binding to other node
	 */
	input: {
		others?: InputBinding[]
	} & Record<string, InputBinding>

	/**
	 * The observed outputs to record.
	 * Key = output socket name
	 * Value = store table name
	 */
	output: Record<string, string>
}

/**
 * Factory function to create new verb configs
 * with as many reasonable defaults as possible.
 * TODO: if we accepted a table (or TableStore) we could do column lookups and such
 * to preselect.
 * @param verb -
 */
export function step<T extends object>({
	verb,
	args = {} as any,
	id = uuid(),
	input = {},
	output = {},
}: StepInput<T>): Step<T> {
	const base = {
		id,
		args,
		verb,
		input: fixInputs(input),
		output: fixOutputs(output),
	}
	switch (verb) {
		case Verb.Bin:
			return {
				...base,
				args: {
					to: 'output',
					strategy: BinStrategy.Auto,
					fixedcount: 10,
					...args,
				},
			}
		case Verb.Aggregate:
		case Verb.Boolean:
		case Verb.Derive:
		case Verb.Fill:
		case Verb.Merge:
		case Verb.Rollup:
		case Verb.Window:
			return {
				...base,
				args: {
					to: 'output',
					...args,
				},
			}
		case Verb.Concat:
		case Verb.Difference:
		case Verb.Intersect:
		case Verb.Union:
			return {
				...base,
				args: {
					others: [],
					...args,
				},
			}
		case Verb.Fold:
			return {
				...base,
				args: {
					to: ['key', 'value'],
					columns: [],
					...args,
				},
			}
		case Verb.Convert:
		case Verb.Erase:
		case Verb.Impute:
		case Verb.Lookup:
		case Verb.Groupby:
		case Verb.Dedupe:
		case Verb.Select:
		case Verb.Unroll:
			return {
				...base,
				args: {
					columns: [],
					...args,
				},
			}
		case Verb.Spread:
			return {
				...base,
				args: {
					to: [],
					...args,
				},
			}
		case Verb.Pivot:
			return {
				...base,
				args: {
					operation: FieldAggregateOperation.Any,
					...args,
				},
			}
		case Verb.Join:
			return {
				...base,
				args: {
					strategy: JoinStrategy.Inner,
					...args,
				},
			}
		case Verb.Binarize:
			return {
				...base,
				args: {
					to: 'output',
					criteria: [],
					logical: BooleanOperator.OR,
					...args,
				},
			}
		case Verb.Filter:
			return {
				...base,
				args: {
					criteria: [],
					logical: BooleanOperator.OR,
					...args,
				},
			}
		case Verb.Fetch:
		case Verb.Onehot:
		case Verb.Orderby:
		case Verb.Rename:
		case Verb.Sample:
		case Verb.Ungroup:
		case Verb.Unorder:
		case Verb.Unfold:
	}
	return base
}

function fixInputs(input: StepInput['input']): Step['input'] {
	if (typeof input === 'string') {
		return { source: { node: input } }
	} else {
		const result: Step['input'] = { ...input } as any
		// rewrite any shorthand inputs into full inputs
		Object.keys(result).forEach((k: string) => {
			const binding = result[k]
			if (typeof binding === 'string') {
				result[k] = { node: binding as string } as InputBinding
			}
		})

		if (result.others != null) {
			result.others = result.others.map(o =>
				typeof o === 'string' ? { node: o } : (o as any as InputBinding),
			)
		}
		return result
	}
}

function fixOutputs(outputs: StepInput['output']): Step['output'] {
	if (typeof outputs === 'string') {
		return { target: outputs }
	} else {
		return outputs as Record<string, string>
	}
}
