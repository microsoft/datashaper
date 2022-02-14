/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types.js'
import { lookup } from '../verbs/lookup.js'
import { TestStore } from './TestStore.js'

describe('test for lookup verb', () => {
	test('lookup test', () => {
		const step: Step = {
			verb: Verb.Lookup,
			input: 'table1',
			output: 'output',
			args: { other: 'table5', on: ['ID'], columns: ['item'] },
		}

		const store = new TestStore()

		return lookup(step, store).then(result => {
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)
		})
	})
})
