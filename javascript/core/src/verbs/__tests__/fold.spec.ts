/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { fold } from '../fold.js'
import { TestStore } from './TestStore.js'

describe('test for fold verb', () => {
	test('fold test with one column', () => {
		const step: Step = {
			verb: Verb.Fold,
			input: 'table1',
			output: 'output',
			args: { to: ['key', 'value'], columns: ['ID'] },
		}

		const store = new TestStore()

		return fold(step, store).then(result => {
			// removed ID column and two new columns were added (key and value)
			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)

			// spot-check the fill value
			expect(result.table.get('name', 0)).toBe('A')
			expect(result.table.get('count', 0)).toBe(10)
			expect(result.table.get('key', 0)).toBe('ID')
			expect(result.table.get('value', 0)).toBe(1)
		})
	})

	test('fold test with two columns', () => {
		const step: Step = {
			verb: Verb.Fold,
			input: 'table1',
			output: 'output',
			args: { to: ['key', 'value'], columns: ['ID', 'name'] },
		}

		const store = new TestStore()

		return fold(step, store).then(result => {
			// removed ID column and two new columns were added (key and value)
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(10)

			expect(result.table.get('count', 0)).toBe(10)
			expect(result.table.get('key', 0)).toBe('ID')
			expect(result.table.get('value', 0)).toBe(1)

			expect(result.table.get('count', 1)).toBe(10)
			expect(result.table.get('key', 1)).toBe('name')
			expect(result.table.get('value', 1)).toBe('A')
		})
	})
})
