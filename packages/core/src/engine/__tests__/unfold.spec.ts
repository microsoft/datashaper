/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types'
import { fold } from '../verbs/fold'
import { unfold } from '../verbs/unfold'
import { TestStore } from './TestStore'

describe('test for unfold verb', () => {
	test('unfold test with multiple columns', async () => {
		const step: Step = {
			verb: Verb.Fold,
			input: 'table18',
			output: 'output',
			args: { to: ['key', 'value'], columns: ['A', 'B', 'C'] },
		}

		const store = new TestStore()

		await fold(step, store).then(result => {
			store.set({ id: 'newTable', table: result })
		})

		const step2: Step = {
			verb: Verb.Fold,
			input: 'newTable',
			output: 'output',
			args: { key: 'key', value: 'value' },
		}

		return unfold(step2, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(3)
			expect(result.get('A', 0)).toBe(1)
			expect(result.get('A', 1)).toBe(3)
			expect(result.get('A', 2)).toBe(10)
			expect(result.get('B', 0)).toBe(2)
			expect(result.get('B', 1)).toBe(4)
			expect(result.get('B', 2)).toBe(20)
			expect(result.get('C', 0)).toBe(3)
			expect(result.get('C', 1)).toBe(5)
			expect(result.get('C', 2)).toBe(30)
		})
	})
})
