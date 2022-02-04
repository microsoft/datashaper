/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types'
import { join } from '../verbs/join'
import { TestStore } from './TestStore'

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
			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(6)
		})
	})
})
