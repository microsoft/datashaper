/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { dedupe } from '../verbs/dedupe.js'
import { TestStore } from './TestStore.js'

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
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(3)
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
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(2)
			expect(result.table.get('x', 0)).toBe('A')
			expect(result.table.get('x', 1)).toBe('B')
			expect(result.table.get('y', 0)).toBe(1)
			expect(result.table.get('y', 1)).toBe(2)
			expect(result.table.get('z', 0)).toBe(4)
			expect(result.table.get('z', 1)).toBe(5)
		})
	})
})
