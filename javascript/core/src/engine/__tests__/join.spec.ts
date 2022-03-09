/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb, JoinStrategy } from '../../types.js'
import { join } from '../verbs/join.js'
import { TestStore } from './TestStore.js'

describe('test for join verb', () => {
	test('inner (default)', () => {
		const step: Step = {
			verb: Verb.Join,
			input: 'table1',
			output: 'output',
			args: { other: 'table5', on: ['ID'] },
		}

		const store = new TestStore()

		return join(step, store).then(result => {
			// ID 3 & 5 in the input do not have a match, so will be removed in default inner join
			expect(result.table.numCols()).toBe(5)
			expect(result.table.numRows()).toBe(6)
		})
	})

	test('left (outer)', () => {
		const step: Step = {
			verb: Verb.Join,
			input: 'table1',
			output: 'output',
			args: { other: 'table5', on: ['ID'], strategy: JoinStrategy.Left },
		}

		const store = new TestStore()

		return join(step, store).then(result => {
			// ID 3 & 5 in the input do not have a match, but will be preserved with left join
			expect(result.table.numCols()).toBe(5)
			expect(result.table.numRows()).toBe(8)
		})
	})

	test('right (outer)', () => {
		const step: Step = {
			verb: Verb.Join,
			input: 'table1',
			output: 'output',
			args: { other: 'table8', on: ['ID'], strategy: JoinStrategy.Right },
		}

		const store = new TestStore()

		return join(step, store).then(result => {
			// ID 6, 7, 8 in the other do not have a match, but will be preserved
			expect(result.table.numCols()).toBe(5)
			expect(result.table.numRows()).toBe(5)
		})
	})

	test('full (outer)', () => {
		const step: Step = {
			verb: Verb.Join,
			input: 'table1',
			output: 'output',
			args: { other: 'table8', on: ['ID'], strategy: JoinStrategy.Full },
		}

		const store = new TestStore()

		return join(step, store).then(result => {
			// ID 1, 2, 3 on input and 6, 7, 8 have no matches
			// but all rows will be preserved in a full outer join
			expect(result.table.numCols()).toBe(5)
			expect(result.table.numRows()).toBe(8)
		})
	})
})
