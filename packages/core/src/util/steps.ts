/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '..'

const INPUT_COLUMN_STEPS: Record<string, boolean> = {
	aggregate: true,
	bin: true,
	binarize: true,
	filter: true,
	impute: true,
	recode: true,
	rollup: true,
	spread: true,
	unroll: true,
}

const OUTPUT_COLUMN_STEPS: Record<string, boolean> = {
	aggregate: true,
	bin: true,
	binarize: true,
	derive: true,
	fill: true,
	recode: true,
	rollup: true,
}

/**
 * Indicates whether the supplied step requires an input column.
 * @param step
 * @returns
 */
export function isInputColumnStep(step: Step): boolean {
	return !!INPUT_COLUMN_STEPS[step.verb]
}

/**
 * Indicates whether the supplied step requires an output column.
 * @param step
 * @returns
 */
export function isOutputColumnStep(step: Step): boolean {
	return !!OUTPUT_COLUMN_STEPS[step.verb]
}

export function inputColumnSteps(): string[] {
	return Object.keys(INPUT_COLUMN_STEPS)
}
