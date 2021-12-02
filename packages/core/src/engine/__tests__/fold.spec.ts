/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, StepType, Verb } from '../../types'
import { fold } from '../verbs/fold'
import { TestStore } from './TestStore'

describe('test for fold verb', () => {
	test('fold test with one column', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Fold,
			input: 'table1',
			output: 'output',
			args: { as: ['key', 'value'], columns: ['ID'] },
		}

		const store = new TestStore()

		return fold(step, store).then(result => {
			// removed ID column and two new columns were added (key and value)
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)

			// spot-check the fill value
			expect(result.get('name', 0)).toBe('A')
			expect(result.get('count', 0)).toBe(10)
			expect(result.get('key', 0)).toBe('ID')
			expect(result.get('value', 0)).toBe(1)
		})
	})

	test('fold test with two columns', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Fold,
			input: 'table1',
			output: 'output',
			args: { as: ['key', 'value'], columns: ['ID', 'name'] },
		}

		const store = new TestStore()

		return fold(step, store).then(result => {
			// removed ID column and two new columns were added (key and value)
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(10)

			expect(result.get('count', 0)).toBe(10)
			expect(result.get('key', 0)).toBe('ID')
			expect(result.get('value', 0)).toBe(1)

			expect(result.get('count', 1)).toBe(10)
			expect(result.get('key', 1)).toBe('name')
			expect(result.get('value', 1)).toBe('A')
		})
	})
})
