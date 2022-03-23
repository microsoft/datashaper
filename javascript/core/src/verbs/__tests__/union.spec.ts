/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { union } from '../union.js'
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
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(6)
			expect(result.table.get('ID', 0)).toBe(1)
		})
	})
})
