/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { join } from '../verbs/join.js'
import { TestStore } from './TestStore.js'

describe('test for join verb', () => {
	test('join test', () => {
		const step: Step = {
			verb: Verb.Join,
			input: 'table1',
			output: 'output',
			args: { other: 'table5', on: ['ID'] },
		}

		const store = new TestStore()

		return join(step, store).then(result => {
			expect(result.table.numCols()).toBe(5)
			expect(result.table.numRows()).toBe(6)
		})
	})
})
