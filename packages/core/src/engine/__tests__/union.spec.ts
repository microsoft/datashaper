/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types.js'
import { union } from '../verbs/union.js'
import { TestStore } from './TestStore.js'

describe('test for union verb', () => {
	test('union test', () => {
		const step: Step = {
			verb: Verb.Union,
			input: 'table1',
			output: 'output',
			args: { others: ['table2'] },
		}

		const store = new TestStore()

		return union(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(6)
			expect(result.get('ID', 0)).toBe(1)
		})
	})
})
