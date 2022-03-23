/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { difference } from '../difference.js'
import { TestStore } from './TestStore.js'

describe('test for difference verb', () => {
	test('difference test with no duplicates', () => {
		const step: Step = {
			verb: Verb.Difference,
			input: 'table1',
			output: 'output',
			args: { others: ['table2'] },
		}

		const store = new TestStore()

		return difference(step, store).then(result => {
			// no dups in table2, so output should match original
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(5)
		})
	})
})
