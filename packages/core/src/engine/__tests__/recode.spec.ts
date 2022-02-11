/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types.js'
import { recode } from '../verbs/recode'
import { TestStore } from './TestStore'

describe('test for recode verb', () => {
	test('recode test with string value', () => {
		const step: Step = {
			verb: Verb.Recode,
			input: 'table1',
			output: 'output',
			args: {
				column: 'name',
				to: 'newColumn',
				map: {
					A: 'Z',
					B: 'Y',
					C: 'X',
				},
			},
		}

		const store = new TestStore()

		return recode(step, store).then(result => {
			// added one new column
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)

			// the first three should change, the last two remain the same
			const getter = result.getter('newColumn')
			expect(getter(0)).toBe('Z')
			expect(getter(1)).toBe('Y')
			expect(getter(2)).toBe('X')
			expect(getter(3)).toBe('D')
			expect(getter(4)).toBe('E')
		})
	})
})
