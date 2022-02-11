/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Verb } from '../../types.js'
import { verbs } from '../steps'

describe('step utilities', () => {
	test('all verbs tagged', () => {
		// ensure that every verb in the canonical enum has a tagged entry
		const canonical = Object.values(Verb)
		const tagged = verbs()
		expect(tagged).toEqual(canonical)
	})
})
