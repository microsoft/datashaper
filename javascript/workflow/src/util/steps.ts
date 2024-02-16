/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '@datashaper/schema'
import cloneDeep from 'lodash-es/cloneDeep.js'
import difference from 'lodash-es/difference.js'
import intersection from 'lodash-es/intersection.js'

import type { Step } from '../resources/index.js'
import { argsHasOutputColumn } from './args.js'
import { nextColumnName } from './workflowSuggestion.js'

enum Tags {
	/**
	 * An input table is required.
	 * CHAIN and FETCH for example do not require table inputs.
	 */
	InputTable = 0,
	/**
	 * More than one input table is required (e.g., set operations).
	 */
	InputTableList = 1,
	/**
	 * A single input column is input
	 */
	InputColumn = 2,
	/**
	 * Input column list
	 */
	InputColumnList = 3,
	/**
	 * The column inputs are a map of string -> string
	 */
	InputColumnRecord = 4,
	/**
	 * A key and value input column are required
	 */
	InputKeyValue = 5,
	/**
	 * A single output column is input
	 */
	OutputColumn = 6,
	/**
	 * This verb can modify the rows of a table
	 */
	RowModifying = 7,
	/**
	 * This verb can only operate on numeric input columns
	 */
	NumericOnly = 8,
	/**
	 * This verb accepts no arguments.
	 */
	NoArgs = 9,
}

// TODO: this could be cleaner with a bitwise operator
const TaggedVerbs: Record<Verb, Tags[]> = {
	aggregate: [
		Tags.InputTable,
		Tags.InputColumn,
		Tags.OutputColumn,
		Tags.RowModifying,
	],
	bin: [Tags.InputTable, Tags.InputColumn, Tags.OutputColumn, Tags.NumericOnly],
	binarize: [Tags.InputTable, Tags.InputColumn, Tags.OutputColumn],
	boolean: [Tags.InputTable, Tags.OutputColumn, Tags.InputColumnList],
	concat: [Tags.InputTable, Tags.InputTableList, Tags.RowModifying],
	convert: [Tags.InputTable, Tags.InputColumn],
	copy: [Tags.InputTable, Tags.OutputColumn, Tags.InputColumn],
	dedupe: [Tags.InputTable, Tags.RowModifying, Tags.InputColumnList],
	derive: [Tags.InputTable, Tags.OutputColumn],
	difference: [Tags.InputTable, Tags.InputTableList, Tags.RowModifying],
	decode: [Tags.InputTable],
	drop: [Tags.InputTable, Tags.InputColumnList],
	encode: [Tags.InputTable],
	erase: [Tags.InputTable, Tags.RowModifying, Tags.InputColumn],
	fill: [Tags.InputTable, Tags.OutputColumn],
	filter: [Tags.InputTable, Tags.InputColumn, Tags.RowModifying],
	fold: [Tags.InputTable, Tags.RowModifying, Tags.InputColumnList],
	groupby: [Tags.InputTable, Tags.InputColumnList],
	impute: [Tags.InputTable, Tags.InputColumn],
	intersect: [Tags.InputTable, Tags.InputTableList, Tags.RowModifying],
	join: [Tags.InputTable, Tags.InputTableList, Tags.RowModifying],
	lookup: [Tags.InputTable, Tags.InputTableList, Tags.RowModifying],
	merge: [Tags.InputTable, Tags.OutputColumn, Tags.InputColumnList],
	print: [Tags.InputTable],
	pivot: [Tags.InputTable, Tags.RowModifying, Tags.InputKeyValue],
	onehot: [Tags.InputTable, Tags.InputColumn],
	orderby: [Tags.InputTable],
	recode: [Tags.InputTable, Tags.InputColumn, Tags.OutputColumn],
	rename: [Tags.InputTable, Tags.InputColumnRecord],
	rollup: [
		Tags.InputTable,
		Tags.InputColumn,
		Tags.OutputColumn,
		Tags.RowModifying,
	],
	sample: [Tags.InputTable, Tags.RowModifying],
	select: [Tags.InputTable, Tags.InputColumnList],
	spread: [Tags.InputTable, Tags.InputColumn],
	destructure: [Tags.InputTable],
	'strings.replace': [Tags.InputTable, Tags.InputColumn, Tags.OutputColumn],
	'strings.lower': [Tags.InputTable, Tags.InputColumn, Tags.OutputColumn],
	'strings.upper': [Tags.InputTable, Tags.InputColumn, Tags.OutputColumn],
	unfold: [Tags.InputTable, Tags.RowModifying, Tags.InputKeyValue],
	ungroup: [Tags.InputTable, Tags.NoArgs],
	unhot: [Tags.InputTable, Tags.OutputColumn, Tags.InputColumnList],
	union: [Tags.InputTable, Tags.InputTableList, Tags.RowModifying],
	unorder: [Tags.InputTable, Tags.NoArgs],
	unroll: [Tags.InputTable, Tags.RowModifying, Tags.InputColumn],
	window: [Tags.InputTable, Tags.InputColumn, Tags.OutputColumn],
	workflow: [Tags.InputTable],
}

const INPUT_TABLE_VERBS = filterByTag(Tags.InputTable)
const INPUT_TABLE_LIST_VERBS = filterByTag(Tags.InputTableList)
const INPUT_COLUMN_VERBS = filterByTag(Tags.InputColumn)
const INPUT_COLUMN_LIST_VERBS = filterByTag(Tags.InputColumnList)
const INPUT_COLUMN_RECORD_VERBS = filterByTag(Tags.InputColumnRecord)
const INPUT_KEY_VALUE_VERBS = filterByTag(Tags.InputKeyValue)
const OUTPUT_COLUMN_VERBS = filterByTag(Tags.OutputColumn)
const ROW_MODIFYING_VERBS = filterByTag(Tags.RowModifying)
const NUMERIC_VERBS = filterByTag(Tags.NumericOnly)
const NO_ARGS_VERBS = filterByTag(Tags.NoArgs)

function filterByTag(tag: Tags) {
	return Object.keys(TaggedVerbs).filter((key) => {
		return TaggedVerbs[key as Verb].findIndex((t) => t === tag) >= 0
	}) as Verb[]
}

/**
 * Indicates whether this step requires an input table.
 * @param step -
 * @returns
 */
export function isInputTableStep(step: Step): boolean {
	return isTagged(step, INPUT_TABLE_VERBS)
}

/**
 * Indicates whether this step requires more than one input table.
 * @param step -
 * @returns
 */
export function isInputTableListStep(step: Step): boolean {
	return isTagged(step, INPUT_TABLE_LIST_VERBS)
}

/**
 * Indicates whether the supplied step requires a single input column.
 * @param step -
 * @returns
 */
export function isInputColumnStep(step: Step): boolean {
	return isTagged(step, INPUT_COLUMN_VERBS)
}

/**
 * Indicates whether the supplied step requires multiple input columns.
 * @param step -
 * @returns
 */
export function isInputColumnListStep(step: Step): boolean {
	return isTagged(step, INPUT_COLUMN_LIST_VERBS)
}

/**
 * Indicates whether the supplied step requires a map of input columns.
 * @param step -
 * @returns
 */
export function isInputColumnRecordStep(step: Step): boolean {
	return isTagged(step, INPUT_COLUMN_RECORD_VERBS)
}

/**
 * Indicates whether the supplied step requires an input key and value column.
 * @param step -
 * @returns
 */
export function isInputKeyValueStep(step: Step): boolean {
	return isTagged(step, INPUT_KEY_VALUE_VERBS)
}

/**
 * Indicates whether the supplied step requires a single output column.
 * @param step -
 * @returns
 */
export function isOutputColumnStep(step: Step): boolean {
	return isTagged(step, OUTPUT_COLUMN_VERBS)
}

/**
 * Indicates whether this step can only operate on numeric values.
 * @param step -
 * @returns
 */
export function isNumericInputStep(step: Step): boolean {
	return isTagged(step, NUMERIC_VERBS)
}

/**
 * Indicates whether this step accepts arguments
 * @param step -
 * @returns
 */
export function isNoArgsStep(step: Step): boolean {
	return isTagged(step, NO_ARGS_VERBS)
}

function isTagged(step: Step, verbs: Verb[]): boolean {
	return verbs.findIndex((v) => v === step.verb) >= 0
}

/**
 * These are steps that specifically operate on an input/output column only.
 * In other words, they do not cause a change in the number of rows in a table,
 * such as an aggregate or filter would, and only replace or add one column.
 * @param filter -
 * @returns
 */
export function columnTransformVerbs(
	filter: (verb: Verb) => boolean = () => true,
): Verb[] {
	const columnBased = intersection(INPUT_COLUMN_VERBS, OUTPUT_COLUMN_VERBS)
	return difference(columnBased, ROW_MODIFYING_VERBS).filter(filter)
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
			clone.args['to'] = nextColumnName(clone.args['to'] as string, columnNames)
		}
	}
	return clone
}
