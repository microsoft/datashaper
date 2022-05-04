/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { readStep } from './readStep.js'
import type { Step, StepInput } from './types.js'

export function readSteps(steps: StepInput[]): Step[] {
	const result: Step[] = []

	for (const stepInput of steps) {
		const current = readStep(stepInput)
		result.push(current)
	}

	return result
}
