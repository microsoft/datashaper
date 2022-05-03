/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { v4 as uuid } from 'uuid'

import type { InputBinding } from '../specification.js'
import {
	BinStrategy,
	BooleanOperator,
	FieldAggregateOperation,
	JoinStrategy,
	Verb,
} from '../verbs/index.js'
import type { Step, StepInput } from './types.js'

/**
 * Factory function to create new verb configs
 * with as many reasonable defaults as possible.
 * TODO: if we accepted a table (or TableStore) we could do column lookups and such
 * to preselect.
 * @param verb -
 */
export function readStep<T extends object | void | unknown = any>(
	{ verb, args = {} as any, id = uuid(), input, output }: StepInput<T>,
	previous?: Step | undefined,
): Step<T> {
	const base = {
		id,
		args,
		verb,
		input: fixInputs(input, previous),
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
					...(args as object),
				} as T,
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
					...(args as object),
				} as T,
			}
		case Verb.Concat:
		case Verb.Difference:
		case Verb.Intersect:
		case Verb.Union:
			return {
				...base,
				args: {
					others: [],
					...(args as object),
				} as T,
			}
		case Verb.Fold:
			return {
				...base,
				args: {
					to: ['key', 'value'],
					columns: [],
					...(args as object),
				} as T,
			}
		case Verb.Convert:
			return {
				...base,
				args: {
					columns: [],
					formatPattern: '%Y-%m-%d',
					...(args as object),
				} as T,
			}
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
					...(args as object),
				} as T,
			}
		case Verb.Spread:
			return {
				...base,
				args: {
					to: [],
					...(args as object),
				} as T,
			}
		case Verb.Pivot:
			return {
				...base,
				args: {
					operation: FieldAggregateOperation.Any,
					...(args as object),
				} as T,
			}
		case Verb.Join:
			return {
				...base,
				args: {
					strategy: JoinStrategy.Inner,
					...(args as object),
				} as T,
			}
		case Verb.Binarize:
			return {
				...base,
				args: {
					to: 'output',
					criteria: [],
					logical: BooleanOperator.OR,
					...(args as object),
				} as T,
			}
		case Verb.Filter:
			return {
				...base,
				args: {
					criteria: [],
					logical: BooleanOperator.OR,
					...(args as object),
				} as T,
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

function fixInputs(
	input: StepInput['input'],
	previous: Step | undefined,
): Step['input'] {
	/**
	 * Case: No input is defined, no previous step available.
	 */
	if (input == null && previous == null) {
		return {}
	} else if (input == null && previous != null) {
		/**
		 * Case: No input is defined, previous step is available, use it's default output
		 */
		return { source: { node: previous.id } }
	} else if (typeof input === 'string') {
		/**
		 * Case: String shorthand is used, convert to object specification
		 */
		return { source: { node: input } }
	} else {
		/**
		 * Case: Object is used, preserve object specs and convert
		 * string-shorthand specs to full input objects
		 */
		const result: Step['input'] = { ...input } as any
		Object.keys(result).forEach((k: string) => {
			const binding = result[k]
			if (typeof binding === 'string') {
				result[k] = { node: binding as string } as InputBinding
			}
		})

		// Handle the variadic case (e.g. "others" array is defined)
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
		return (outputs || {}) as Record<string, string>
	}
}
