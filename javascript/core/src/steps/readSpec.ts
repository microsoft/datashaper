/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { readSteps } from './readSteps.js'
import type { SpecificationInput, Step } from './types.js'

export function readSpec(spec: SpecificationInput): Step[] {
	if (spec.steps.length === 0) {
		return []
	}

	// Detect if a specification collision on the workflow input is present
	const firstStep = spec.steps[0]!
	const lastStep = spec.steps[spec.steps.length - 1]!
	if (spec.input != null && firstStep.input != null) {
		throw new Error(
			'workflow.input and steps[0].input are both defined when only one should be',
		)
	}
	if (spec.output != null && lastStep.output != null) {
		throw new Error(
			'workflow.output and steps[length-1].output are both defined when only one should be',
		)
	}

	let steps = spec.steps
	// If a workflow input is present, weave it into the input of the first step
	if (spec.input != null) {
		steps = [{ ...firstStep, input: spec.input }, ...spec.steps.slice(1)]
	}

	// If a workflow output is present, weave it into the output of the final step
	if (spec.output != null) {
		steps = [
			...steps.slice(0, steps.length - 1),
			{ ...lastStep, output: spec.output },
		]
	}
	return readSteps(steps)
}
