/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types'
import { dedupe } from '../verbs/dedupe'
import { TestStore } from './TestStore'

describe('test for dedupe verb', () => {
	test('dedupe test with column', () => {
		const step: Step = {
			verb: Verb.Dedupe,
			input: 'table3',
			output: 'output',
			args: {
				columns: ['ID'],
			},
		}

		const store = new TestStore()

		return dedupe(step, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(3)
		})
	})

	test('dedupe test without columns', () => {
		const step: Step = {
			verb: Verb.Dedupe,
			input: 'table10',
			output: 'output',
			args: {},
		}

		const store = new TestStore()

		return dedupe(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(2)
			expect(result.get('x', 0)).toBe('A')
			expect(result.get('x', 1)).toBe('B')
			expect(result.get('y', 0)).toBe(1)
			expect(result.get('y', 1)).toBe(2)
			expect(result.get('z', 0)).toBe(4)
			expect(result.get('z', 1)).toBe(5)
		})
	})
})
