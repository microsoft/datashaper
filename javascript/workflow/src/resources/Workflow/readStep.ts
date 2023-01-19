/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { NamedPortBinding, Verb } from '@datashaper/schema'

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
	const factories = defaults as any as Record<string, () => Partial<T>>
	const factory = factories[verb]

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
	if (input == null && previous == null) {
		return {}
	} else if (input == null && previous != null) {
		/**
		 * Case: No input is defined, previous step is available, use it's default output
		 */
		return { source: { node: previous.id } }
	} else if (typeof input === 'string') {
		/**
		 * Case: String shorthand is used, convert to object specification
		 */
		return { source: { node: input } }
	} else {
		/**
		 * Case: Object is used, preserve object specs and convert
		 * string-shorthand specs to full input objects
		 */
		const result: Step['input'] = { ...input } as any
		Object.keys(result).forEach((k: string) => {
			const binding = result[k]
			if (typeof binding === 'string') {
				result[k] = { node: binding as string } as NamedPortBinding
			}
		})

		// Handle the variadic case (e.g. "others" array is defined)
		if (result.others != null) {
			result.others = result.others.map((o) =>
				typeof o === 'string' ? { node: o } : (o as any as NamedPortBinding),
			)
		}
		return result
	}
}
