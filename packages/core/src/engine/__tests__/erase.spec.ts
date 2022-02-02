/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, StepType, Verb } from '../../types'
import { erase } from '../verbs/erase'
import { TestStore } from './TestStore'

describe('test for erase verb', () => {
	test('erase numeric value', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Erase,
			input: 'table3',
			output: 'output',
			args: { value: 4, to: 'ID' },
		}

		const store = new TestStore()

		return erase(step, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(6)
			expect(result.get('ID', 3)).toBe(undefined)
			expect(result.get('ID', 4)).toBe(undefined)
			expect(result.get('ID', 5)).toBe(undefined)
		})
	})

	test('erase string value', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Erase,
			input: 'table3',
			output: 'output',
			args: { value: 'sofa', to: 'item' },
		}

		const store = new TestStore()

		return erase(step, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(6)
			expect(result.get('item', 2)).toBe(undefined)
			expect(result.get('item', 3)).toBe(undefined)
		})
	})
})
