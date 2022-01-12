/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, StepType, Verb } from '../../types'
import { fill } from '../verbs/fill'
import { TestStore } from './TestStore'

describe('test for fill verb', () => {
	test('fill test with string value', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Fill,
			input: 'table1',
			output: 'output',
			args: { to: 'newColumn', value: 'false' },
		}

		const store = new TestStore()

		return fill(step, store).then(result => {
			// added one new column
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)

			// spot-check the fill value
			expect(result.get('newColumn', 0)).toBe('false')
			expect(result.get('newColumn', 1)).toBe('false')
			expect(result.get('newColumn', 2)).toBe('false')
			expect(result.get('newColumn', 3)).toBe('false')
			expect(result.get('newColumn', 4)).toBe('false')
		})
	})

	test('fill test with number value', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Fill,
			input: 'table1',
			output: 'output',
			args: { to: 'newColumn', value: 20 },
		}

		const store = new TestStore()

		return fill(step, store).then(result => {
			// added one new column
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)

			// spot-check the fill value
			expect(result.get('newColumn', 0)).toBe(20)
			expect(result.get('newColumn', 1)).toBe(20)
			expect(result.get('newColumn', 2)).toBe(20)
			expect(result.get('newColumn', 3)).toBe(20)
			expect(result.get('newColumn', 4)).toBe(20)
		})
	})
})
