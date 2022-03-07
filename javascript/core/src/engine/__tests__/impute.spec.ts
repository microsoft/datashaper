/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { impute } from '../verbs/impute.js'
import { TestStore } from './TestStore.js'

describe('test for impute verb', () => {
	test('impute test with string value', () => {
		const step: Step = {
			verb: Verb.Impute,
			input: 'table5',
			output: 'output',
			args: { to: 'item', value: 'emptyValue' },
		}

		const store = new TestStore()

		return impute(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(6)
			expect(result.table.get('item', 0)).toBe('bed')
			expect(result.table.get('item', 1)).toBe('emptyValue')
			expect(result.table.get('item', 4)).toBe('chair')
			expect(result.table.get('item', 5)).toBe('emptyValue')
		})
	})

	test('impute test with number value', () => {
		const step: Step = {
			verb: Verb.Impute,
			input: 'table11',
			output: 'output',
			args: { to: 'y', value: 5000 },
		}

		const store = new TestStore()

		return impute(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(3)
			expect(result.table.get('y', 0)).toBe(1)
			expect(result.table.get('y', 1)).toBe(5000)
			expect(result.table.get('y', 2)).toBe(1)
		})
	})
})
