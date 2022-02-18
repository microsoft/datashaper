/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types.js'
import { groupby } from '../verbs/groupby.js'
import { ungroup } from '../verbs/ungroup.js'
import { TestStore } from './TestStore.js'

describe('test for ungroup verb', () => {
	test('ungroup test', async () => {
		const step: Step = {
			verb: Verb.Groupby,
			input: 'table10',
			output: 'output',
			args: {
				columns: ['x', 'y'],
			},
		}

		const store = new TestStore()

		await groupby(step, store).then(result => {
			store.set({ id: 'newTable', table: result })

			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(3)

			expect(result.get('x', 0)).toBe('A')
			expect(result.get('x', 1)).toBe('B')
			expect(result.get('x', 2)).toBe('A')
		})

		const step2: Step = {
			verb: Verb.Ungroup,
			input: 'newTable',
			output: 'output',
			args: {},
		}

		return ungroup(step2, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(3)

			expect(result.get('x', 0)).toBe('A')
			expect(result.get('x', 1)).toBe('B')
			expect(result.get('x', 2)).toBe('A')
		})
	})
})
