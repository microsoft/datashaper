/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Verb } from '@datashaper/schema'

import { verbs } from '../steps.js'

describe('step utilities', () => {
	test('all verbs tagged', () => {
		// ensure that every verb in the canonical enum has a tagged entry
		const canonical = new Set<Verb>(Object.values(Verb))
		const tagged = new Set<Verb>(verbs())

		canonical.forEach((c) => expect(tagged.has(c)).toBeTruthy())
		tagged.forEach((c) => expect(canonical.has(c)).toBeTruthy())
	})
})
