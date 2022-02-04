/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types'
import { spread } from '../verbs/spread'
import { TestStore } from './TestStore'

describe('test for spread verb', () => {
	test('spread test', () => {
		const step: Step = {
			verb: Verb.Spread,
			input: 'table6',
			output: 'output',
			args: {
				columns: ['ID'],
			},
		}

		const store = new TestStore()

		return spread(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(6)
			expect(result.get('ID_1', 0)).toBe(1)
		})
	})
})
