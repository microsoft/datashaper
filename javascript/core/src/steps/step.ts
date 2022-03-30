/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { v4 as uuid } from 'uuid'

import type { CopyWithPartial } from '../primitives.js'
import {
	BinStrategy,
	BooleanOperator,
	FieldAggregateOperation,
	JoinStrategy,
	Verb,
} from '../verbs/index.js'
import type { InputBinding, Step, StepSpecification } from './types.js'

export type StepInput = CopyWithPartial<
	Step<any>,
	'args' | 'id' | 'inputs' | 'outputs'
>
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
	inputs = {},
	outputs = {},
}: StepSpecification<T>): Step<T> {
	const base = {
		id,
		args,
		verb,
		inputs: fixInputs(inputs),
		outputs: fixOutputs(outputs),
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
		case Verb.Impute:
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
		case Verb.Orderby:
		case Verb.Rename:
		case Verb.Sample:
		case Verb.Ungroup:
		case Verb.Unorder:
		case Verb.Erase:
		case Verb.Unfold:
	}
	return base
}

function fixInputs(inputs: StepSpecification['inputs']): Step['inputs'] {
	if (typeof inputs === 'string') {
		return { default: { node: inputs } }
	} else {
		const result: Step['inputs'] = { ...inputs } as any
		// rewrite any shorthand inputs into full inputs
		Object.keys(result).forEach((k: string) => {
			const binding = result[k]
			if (typeof binding === 'string') {
				result[k] = { node: binding } as InputBinding
			}
		})

		if (result.others != null) {
			result.others = result.others.map(o =>
				typeof o === 'string' ? { node: o } : (o as InputBinding),
			)
		}
		return result
	}
}

function fixOutputs(outputs: StepSpecification['outputs']): Step['outputs'] {
	if (typeof outputs === 'string') {
		return { default: outputs }
	} else {
		return outputs as Record<string, string>
	}
}
