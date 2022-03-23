/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { groupby } from '../groupby.js'
import { ungroup } from '../ungroup.js'
import { TestStore } from './TestStore.js'

describe('test for ungroup verb', () => {
	test('ungroup test', async () => {
		const step: Step = {
			verb: Verb.Groupby,
			input: 'table10',
			output: 'newTable',
			args: {
				columns: ['x', 'y'],
			},
		}

		const store = new TestStore()

		await groupby(step, store).then(result => {
			store.set(result)

			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(3)

			expect(result.table.get('x', 0)).toBe('A')
			expect(result.table.get('x', 1)).toBe('B')
			expect(result.table.get('x', 2)).toBe('A')
		})

		const step2: Step = {
			verb: Verb.Ungroup,
			input: 'newTable',
			output: 'output',
			args: {},
		}

		return ungroup(step2, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(3)

			expect(result.table.get('x', 0)).toBe('A')
			expect(result.table.get('x', 1)).toBe('B')
			expect(result.table.get('x', 2)).toBe('A')
		})
	})
})
