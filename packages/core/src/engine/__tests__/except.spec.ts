/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, StepType, Verb } from '../../types'
import { except } from '../verbs/except'
import { TestStore } from './TestStore'

describe('test for except verb', () => {
	test('except test with no duplicates', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Except,
			input: 'table1',
			output: 'output',
			args: { others: ['table2'] },
		}

		const store = new TestStore()

		return except(step, store).then(result => {
			// no dups in table2, so output should match original
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(5)
		})
	})
})
