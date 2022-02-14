/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types.js'
import { concat } from '../verbs/concat.js'
import { TestStore } from './TestStore.js'

describe('test for concat verb', () => {
	test('concat test', () => {
		const step: Step = {
			verb: Verb.Concat,
			input: 'table1',
			output: 'output',
			args: { others: ['table2'] },
		}

		const store = new TestStore()

		return concat(step, store).then(result => {
			// no change to column count
			expect(result.numCols()).toBe(3)
			// combined rows of 5 + 1
			expect(result.numRows()).toBe(6)
			expect(result.get('count', 0)).toBe(10)
			expect(result.get('count', 1)).toBe(20)
			expect(result.get('count', 2)).toBe(30)
			expect(result.get('count', 3)).toBe(40)
			expect(result.get('count', 4)).toBe(50)
			expect(result.get('count', 5)).toBe(60)
		})
	})
})
