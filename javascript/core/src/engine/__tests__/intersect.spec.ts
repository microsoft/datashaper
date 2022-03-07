/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { intersect } from '../verbs/intersect.js'
import { TestStore } from './TestStore.js'

describe('test for intersect verb', () => {
	test('intersect test with no duplicates', () => {
		const step: Step = {
			verb: Verb.Intersect,
			input: 'table4',
			output: 'output',
			args: { others: ['table5'] },
		}

		const store = new TestStore()

		return intersect(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(4)
			expect(result.table.get('ID', 0)).toBe(1)
			expect(result.table.get('ID', 1)).toBe(2)
			expect(result.table.get('ID', 2)).toBe(4)
			expect(result.table.get('ID', 3)).toBe(4)
		})
	})
})
