/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { difference } from 'lodash'
import { Step, Verb } from '..'

// TODO: this would all be much cleaner if the canonical list
// of verbs had flags
const INPUT_COLUMN_STEPS: Verb[] = [
	Verb.Aggregate,
	Verb.Bin,
	Verb.Binarize,
	Verb.Filter,
	Verb.Impute,
	Verb.Recode,
	Verb.Rollup,
	Verb.Spread,
	Verb.Unroll,
]

const OUTPUT_COLUMN_STEPS: Verb[] = [
	Verb.Aggregate,
	Verb.Bin,
	Verb.Binarize,
	Verb.Derive,
	Verb.Fill,
	Verb.Recode,
	Verb.Rollup,
]

const ROW_MODIFYING_STEPS: Verb[] = [
	Verb.Aggregate,
	Verb.Concat,
	Verb.Dedupe,
	Verb.Difference,
	Verb.Filter,
	Verb.Fold,
	Verb.Intersect,
	Verb.Join,
	Verb.Rollup,
	Verb.Sample,
	Verb.Union,
]

const INPUT_COLUMN_SET = new Set(INPUT_COLUMN_STEPS)
const OUTPUT_COLUMN_SET = new Set(OUTPUT_COLUMN_STEPS)

/**
 * Indicates whether the supplied step requires an input column.
 * @param step
 * @returns
 */
export function isInputColumnStep(step: Step): boolean {
	return INPUT_COLUMN_SET.has(step.verb)
}

/**
 * Indicates whether the supplied step requires an output column.
 * @param step
 * @returns
 */
export function isOutputColumnStep(step: Step): boolean {
	return OUTPUT_COLUMN_SET.has(step.verb)
}

/**
 * These are steps that specifically operate on an input/output column.
 * In other words, they do not cause a change in the number of rows in a table,
 * such as an aggregate or filter would.
 * @param filter
 * @returns
 */
export function columnTransformSteps(
	filter: (verb: Verb) => boolean = () => true,
): Verb[] {
	return difference(INPUT_COLUMN_STEPS, ROW_MODIFYING_STEPS).filter(filter)
}
