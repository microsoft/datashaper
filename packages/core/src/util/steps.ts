/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '..'

const inputColumnSteps: Record<string, boolean> = {
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

const outputColumnSteps: Record<string, boolean> = {
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
	return !!inputColumnSteps[step.verb]
}

/**
 * Indicates whether the supplied step requires an output column.
 * @param step
 * @returns
 */
export function isOutputColumnStep(step: Step): boolean {
	return !!outputColumnSteps[step.verb]
}
