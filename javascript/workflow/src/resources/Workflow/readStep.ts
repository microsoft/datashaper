/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Verb } from '@datashaper/schema'

import * as defaults from '../../verbs/defaults/index.js'
import type { Step, StepInput } from './types.js'

// TEMP: this creates a more readable id by doing a simple increment for each verb type
// since this is global it will not align across pipelines or tables.
// however, it will eventually be replaced with graph interrogation methods that let us
// construct much smarter and more user friendly ids
const uid = (() => {
	const map = new Map<string, number>()
	return (verb: Verb) => {
		const next = (map.get(verb) || 0) + 1
		map.set(verb, next)
		return `${verb} (${next})`
	}
})()

/**
 * Factory function to create new verb configs
 * with as many reasonable defaults as possible.
 * @param verb -
 */
export function readStep<T extends object | void | unknown = any>(
	{ verb, args = {} as any, id, input }: StepInput<T>,
	previous?: Step | undefined,
): Step<T> {
	const base = {
		id: id || uid(verb),
		args,
		verb,
		input: resolveInputs(input, previous),
	}

	// each verb should have default verb-specific params defined, load them up and merge into the step
	// note that scoped verbs will have a root and a sub-object in their name, check for this case
	const factories = defaults as any
	const [root, sub] = verb.split('.')
	// rome-ignore lint/style/noNonNullAssertion: if the split has a second value, the first will be defined
	const factory: () => Partial<T> = sub ? factories[root!][sub] : factories[root!]

	if (!factory) {
		throw new Error(`missing verb defaults [${verb}]`)
	}

	return {
		...base,
		args: {
			...factory(),
			...(args as Partial<T>),
		} as T,
	}
}

function resolveInputs(
	input: StepInput['input'],
	previous: Step | undefined,
): Step['input'] {
	/**
	 * Case: No input is defined, no previous step available.
	 */
	if (input == null) {
		if (previous == null) {
			/**
			 * Case: No input is defined, no previous step available.
			 * This is the first step
			 */
			return {}
		} else {
			/**
			 * Case: No input is defined, previous step is available, use it's default output
			 */
			return { source: previous.id }
		}
	} else if (typeof input === 'string') {
		/**
		 * Case: String shorthand is used, convert to object specification
		 */
		return { source: input }
	} else {
		/**
		 * Case 4: Object specification is used, return as-is
		 */
		return input
	}
}
