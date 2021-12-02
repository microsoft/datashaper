/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, StepType, Verb } from '../../types'
import { select } from '../verbs/select'
import { TestStore } from './TestStore'

describe('test for select verb', () => {
	test('select test', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Select,
			input: 'table7',
			output: 'output',
			args: {
				columns: { ID: 'ID', item: 'item' },
			},
		}

		const store = new TestStore()

		return select(step, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(5)
		})
	})
})
