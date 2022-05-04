/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NamedOutputPortBinding } from '../types.js'
import { readSteps } from './readSteps.js'
import type { ParsedSpecification, SpecificationInput } from './types.js'

export function readSpec(spec: SpecificationInput): ParsedSpecification {
	return {
		input: new Set<string>(spec.input || []),
		output: fixOutput(spec.output),
		steps: readSteps(spec.steps),
	}
}

function fixOutput(
	outputs: SpecificationInput['output'],
): ParsedSpecification['output'] {
	const result = new Map<string, NamedOutputPortBinding>()
	for (const binding of outputs) {
		if (typeof binding === 'string') {
			result.set(binding, { name: binding as string, node: binding as string })
		} else {
			result.set(binding.name, binding)
		}
	}
	return result
}
