/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { fill } from '../verbs/fill.js'
import { TestStore } from './TestStore.js'

describe('test for fill verb', () => {
	test('fill test with string value', () => {
		const step: Step = {
			verb: Verb.Fill,
			input: 'table1',
			output: 'output',
			args: { to: 'newColumn', value: 'false' },
		}

		const store = new TestStore()

		return fill(step, store).then(result => {
			// added one new column
			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)

			// spot-check the fill value
			expect(result.table.get('newColumn', 0)).toBe('false')
			expect(result.table.get('newColumn', 1)).toBe('false')
			expect(result.table.get('newColumn', 2)).toBe('false')
			expect(result.table.get('newColumn', 3)).toBe('false')
			expect(result.table.get('newColumn', 4)).toBe('false')
		})
	})

	test('fill test with number value', () => {
		const step: Step = {
			verb: Verb.Fill,
			input: 'table1',
			output: 'output',
			args: { to: 'newColumn', value: 20 },
		}

		const store = new TestStore()

		return fill(step, store).then(result => {
			// added one new column
			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)

			// spot-check the fill value
			expect(result.table.get('newColumn', 0)).toBe(20)
			expect(result.table.get('newColumn', 1)).toBe(20)
			expect(result.table.get('newColumn', 2)).toBe(20)
			expect(result.table.get('newColumn', 3)).toBe(20)
			expect(result.table.get('newColumn', 4)).toBe(20)
		})
	})
})
