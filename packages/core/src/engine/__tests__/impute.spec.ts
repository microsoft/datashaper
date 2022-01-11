/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, StepType, Verb } from '../../types'
import { impute } from '../verbs/impute'
import { TestStore } from './TestStore'

describe('test for impute verb', () => {
	test('impute test with string value', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Impute,
			input: 'table5',
			output: 'output',
			args: { to: 'item', value: 'emptyValue' },
		}

		const store = new TestStore()

		return impute(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(6)
			expect(result.get('item', 0)).toBe('bed')
			expect(result.get('item', 1)).toBe('emptyValue')
			expect(result.get('item', 4)).toBe('chair')
			expect(result.get('item', 5)).toBe('emptyValue')
		})
	})

	test('impute test with number value', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Impute,
			input: 'table11',
			output: 'output',
			args: { to: 'y', value: 5000 },
		}

		const store = new TestStore()

		return impute(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(3)
			expect(result.get('y', 0)).toBe(1)
			expect(result.get('y', 1)).toBe(5000)
			expect(result.get('y', 2)).toBe(1)
		})
	})
})
