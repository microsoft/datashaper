/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputBinding, Step, WorkflowStepId } from '@datashaper/schema'
import type { NodeInput } from '@datashaper/workflow'

/**
 * Get the input node id from a step
 *
 * @param step - The step to get the input node id from
 * @param input - The input name to get the node id from
 * @returns The node id of the input name
 */
export function getInputNode(
	step: Step,
	input: NodeInput,
): WorkflowStepId | undefined {
	if (step.input == null) {
		return undefined
	}
	const binding = (step.input as any)[input] as InputBinding
	return binding?.node
}
