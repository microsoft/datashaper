/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import difference from 'lodash-es/difference.js'
import intersection from 'lodash-es/intersection.js'
import type { Step, Verb } from '../index.js'

enum Tags {
	/**
	 * A single input column is input
	 */
	InputColumn,
	/**
	 * A single output  column is input
	 */
	OutputColumn,
	/**
	 * This verb can modify the rows of a table
	 */
	RowModifying,
}

// TODO: this could be cleaner with a bitwise operator
const TaggedVerbs: Record<Verb, Tags[]> = {
	aggregate: [Tags.InputColumn, Tags.OutputColumn, Tags.RowModifying],
	bin: [Tags.InputColumn, Tags.OutputColumn],
	binarize: [Tags.InputColumn, Tags.OutputColumn],
	chain: [],
	concat: [Tags.RowModifying],
	dedupe: [Tags.RowModifying],
	derive: [Tags.OutputColumn],
	difference: [Tags.RowModifying],
	erase: [Tags.InputColumn, Tags.RowModifying],
	fetch: [],
	fill: [Tags.OutputColumn],
	filter: [Tags.InputColumn, Tags.RowModifying],
	fold: [Tags.RowModifying],
	groupby: [],
	impute: [Tags.InputColumn],
	intersect: [Tags.RowModifying],
	join: [Tags.RowModifying],
	lookup: [Tags.RowModifying],
	merge: [Tags.OutputColumn],
	pivot: [Tags.RowModifying],
	orderby: [],
	recode: [Tags.InputColumn, Tags.OutputColumn],
	rename: [],
	rollup: [Tags.InputColumn, Tags.OutputColumn, Tags.RowModifying],
	sample: [Tags.RowModifying],
	select: [],
	spread: [],
	unfold: [Tags.RowModifying],
	ungroup: [],
	union: [Tags.RowModifying],
	unorder: [],
	unroll: [Tags.InputColumn, Tags.RowModifying],
}

const INPUT_COLUMN_VERBS = filterByTag(Tags.InputColumn)
const OUTPUT_COLUMN_VERBS = filterByTag(Tags.OutputColumn)
const ROW_MODIFYING_VERBS = filterByTag(Tags.RowModifying)

function filterByTag(tag: Tags) {
	return Object.keys(TaggedVerbs).filter(key => {
		return TaggedVerbs[key as Verb].findIndex(t => t === tag) >= 0
	}) as Verb[]
}

/**
 * Indicates whether the supplied step requires a single input column.
 * @param step
 * @returns
 */
export function isInputColumnStep(step: Step): boolean {
	return INPUT_COLUMN_VERBS.findIndex(v => v === step.verb) >= 0
}

/**
 * Indicates whether the supplied step requires a single output column.
 * @param step
 * @returns
 */
export function isOutputColumnStep(step: Step): boolean {
	return OUTPUT_COLUMN_VERBS.findIndex(v => v === step.verb) >= 0
}

/**
 * These are steps that specifically operate on an input/output column only.
 * In other words, they do not cause a change in the number of rows in a table,
 * such as an aggregate or filter would, and only replace or add one column.
 * @param filter
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
 * @param filter
 * @returns
 */
export function verbs(filter: (verb: Verb) => boolean = () => true): Verb[] {
	return (Object.keys(TaggedVerbs) as Verb[]).filter(filter)
}
