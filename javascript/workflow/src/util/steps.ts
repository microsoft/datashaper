/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType, Verb } from '@datashaper/schema'
import cloneDeep from 'lodash-es/cloneDeep.js'

import type { Step } from '../resources/index.js'
import { argsHasOutputColumn } from './args.js'
import { nextColumnName } from './workflowSuggestion.js'

/**
 * Tags to assign to each verb for requirements querying.
 * TODO: it would be nice if this was collocated with each verb.
 */
interface TaggedVerb {
	/**
	 * More than one input table is required (e.g., set operations).
	 */
	inputTableList?: boolean
	/**
	 * A single input column is input
	 */
	inputColumn?: boolean
	/**
	 * A list of input columns is required (e.g., merge)
	 */
	inputColumnList?: boolean
	/**
	 * The column inputs are a map of string -> string (this is for rename)
	 */
	inputColumnRecord?: boolean
	/**
	 * A key and value input column are required
	 */
	inputKeyValue?: boolean
	/**
	 * A single new output column is created
	 */
	outputColumn?: boolean
	/**
	 * This verb can modify the row count of a table (e.g., via rollup or filtering)
	 */
	rowModifying?: boolean
	/**
	 * This verb accepts no arguments.
	 */
	noArgs?: boolean
	/**
	 * Indicates that this verb can only operate on the specified types.
	 * Absence of this property indicates that the verb can operate on any type.
	 */
	dataTypeConstraints?: DataType[]
}

const TaggedVerbs: Record<Verb, TaggedVerb> = {
	aggregate: {
		inputColumn: true,
		outputColumn: true,
		rowModifying: true,
	},
	bin: {
		inputColumn: true,
		outputColumn: true,
		dataTypeConstraints: [DataType.Number, DataType.Integer],
	},
	binarize: {
		inputColumn: true,
		outputColumn: true,
	},
	boolean: {
		outputColumn: true,
		inputColumnList: true,
	},
	concat: {
		inputTableList: true,
		rowModifying: true,
	},
	convert: {
		inputColumn: true,
	},
	copy: {
		outputColumn: true,
		inputColumn: true,
	},
	dedupe: {
		rowModifying: true,
		inputColumnList: true,
	},
	derive: {
		outputColumn: true,
	},
	difference: {
		inputTableList: true,
		rowModifying: true,
	},
	decode: {},
	destructure: {
		inputColumn: true,
		dataTypeConstraints: [DataType.Object],
	},
	drop: {
		inputColumnList: true,
	},
	encode: {},
	erase: {
		rowModifying: true,
		inputColumn: true,
	},
	fill: {
		outputColumn: true,
	},
	filter: {
		inputColumn: true,
		rowModifying: true,
	},
	fold: {
		rowModifying: true,
		inputColumnList: true,
	},
	groupby: {
		inputColumnList: true,
	},
	impute: {
		inputColumn: true,
	},
	intersect: {
		inputTableList: true,
		rowModifying: true,
	},
	join: {
		inputTableList: true,
		rowModifying: true,
	},
	lookup: {
		inputTableList: true,
		rowModifying: true,
	},
	merge: {
		outputColumn: true,
		inputColumnList: true,
	},
	print: {},
	pivot: {
		rowModifying: true,
		inputKeyValue: true,
	},
	onehot: {
		inputColumn: true,
	},
	orderby: {},
	recode: {
		inputColumn: true,
		outputColumn: true,
	},
	rename: {
		inputColumnRecord: true,
	},
	rollup: {
		inputColumn: true,
		outputColumn: true,
		rowModifying: true,
	},
	sample: {
		rowModifying: true,
	},
	select: {
		inputColumnList: true,
	},
	spread: {
		inputColumn: true,
		dataTypeConstraints: [DataType.Array],
	},
	'strings.replace': {
		inputColumn: true,
		outputColumn: true,
		dataTypeConstraints: [DataType.String],
	},
	'strings.lower': {
		inputColumn: true,
		outputColumn: true,
		dataTypeConstraints: [DataType.String],
	},
	'strings.upper': {
		inputColumn: true,
		outputColumn: true,
		dataTypeConstraints: [DataType.String],
	},
	unfold: {
		rowModifying: true,
		inputKeyValue: true,
	},
	ungroup: {
		noArgs: true,
	},
	unhot: {
		outputColumn: true,
		inputColumnList: true,
	},

	union: {
		inputTableList: true,
		rowModifying: true,
	},
	unorder: {
		noArgs: true,
	},

	unroll: {
		rowModifying: true,
		inputColumn: true,
		dataTypeConstraints: [DataType.Array],
	},
	window: {
		inputColumn: true,
		outputColumn: true,
	},
	workflow: {}
}

/**
 * Indicates whether this step requires more than one input table.
 * @param step -
 * @returns
 */
export function isInputTableListStep(verb: Verb): boolean {
	return !!TaggedVerbs[verb].inputTableList
}

/**
 * Indicates whether the supplied step requires a single input column.
 * @param step -
 * @returns
 */
export function isInputColumnStep(verb: Verb): boolean {
	return !!TaggedVerbs[verb].inputColumn
}

/**
 * Indicates whether the supplied step requires multiple input columns.
 * @param step -
 * @returns
 */
export function isInputColumnListStep(verb: Verb): boolean {
	return !!TaggedVerbs[verb].inputColumnList
}

/**
 * Indicates whether the supplied step requires a map of input columns.
 * @param step -
 * @returns
 */
export function isInputColumnRecordStep(verb: Verb): boolean {
	return !!TaggedVerbs[verb].inputColumnRecord
}

/**
 * Indicates whether the supplied step requires an input key and value column.
 * @param step -
 * @returns
 */
export function isInputKeyValueStep(verb: Verb): boolean {
	return !!TaggedVerbs[verb].inputKeyValue
}

/**
 * Indicates whether the supplied step requires a single output column.
 * @param step -
 * @returns
 */
export function isOutputColumnStep(verb: Verb): boolean {
	return !!TaggedVerbs[verb].outputColumn
}

/**
 * Indicates whether this step accepts arguments
 * @param step -
 * @returns
 */
export function isNoArgsStep(verb: Verb): boolean {
	return !!TaggedVerbs[verb].noArgs
}

// TODO: this is only used in one place to filter columns, and could be replaced with more generic logic for any type matching
export function isNumericInputStep(verb: Verb): boolean {
	return (
		isDataTypeSupported(verb, DataType.Number) ||
		isDataTypeSupported(verb, DataType.Integer)
	)
}

/**
 * Returns all verbs, subject to optional filter.
 * @param filter -
 * @returns
 */
export function verbs(filter: (verb: Verb) => boolean = () => true): Verb[] {
	return (Object.keys(TaggedVerbs) as Verb[]).filter(filter)
}

export function cloneStep(
	step: Step<unknown>,
	columnNames?: string[],
): Step<unknown> {
	const clone = cloneDeep(step) as any
	if (columnNames?.length) {
		if (argsHasOutputColumn(clone.args)) {
			clone.args.to = nextColumnName(clone.args.to as string, columnNames)
		}
	}
	return clone
}

/**
 * Indicates whether the specified data type is supported by the step.
 * @param verb
 * @param type
 * @returns
 */
export function isDataTypeSupported(verb: Verb, type?: DataType): boolean {
	const constraints = TaggedVerbs[verb]?.dataTypeConstraints
	if (!constraints || !type) {
		return true
	}
	return !!constraints.find((t) => t === type)
}
