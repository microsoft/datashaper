/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowInput } from '@datashaper/schema'

import type { Node, SocketName } from '../../dataflow/types.js'
import type { Step } from './types.js'

export function hasDefinedInputs(step: Step): boolean {
	return Object.keys(step.input).length > 0
}

export function hasPossibleInputs(node: Node<unknown>): boolean {
	return node.inputs.length > 0
}

export function unique<T>(arr: T[]): T[] {
	return [...new Set(arr).values()]
}

export function isVariadicSocketName(
	input: SocketName,
	binding: WorkflowInput | WorkflowInput[],
): binding is WorkflowInput[] {
	return input === 'others' || Array.isArray(binding)
}
