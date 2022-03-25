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
import type { Step } from './types.js'

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
export function step({
	verb,
	args = {},
	id = uuid(),
	inputs = {},
	outputs = {},
}: StepInput): Step {
	const base = {
		id,
		args,
		verb,
		inputs,
		outputs,
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
