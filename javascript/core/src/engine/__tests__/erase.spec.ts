/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types'
import { Verb } from '../../types'
import { erase } from '../verbs/erase'
import { TestStore } from './TestStore'

describe('test for erase verb', () => {
	test('erase numeric value', () => {
		const step: Step = {
			verb: Verb.Erase,
			input: 'table3',
			output: 'output',
			args: { value: 4, column: 'ID' },
		}

		const store = new TestStore()

		return erase(step, store).then(result => {
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(6)
			expect(result.table.get('ID', 3)).toBeUndefined()
			expect(result.table.get('ID', 4)).toBeUndefined()
			expect(result.table.get('ID', 5)).toBeUndefined()
		})
	})

	test('erase string value', () => {
		const step: Step = {
			verb: Verb.Erase,
			input: 'table3',
			output: 'output',
			args: { value: 'sofa', column: 'item' },
		}

		const store = new TestStore()

		return erase(step, store).then(result => {
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(6)
			expect(result.table.get('item', 2)).toBeUndefined()
			expect(result.table.get('item', 3)).toBeUndefined()
		})
	})
})
