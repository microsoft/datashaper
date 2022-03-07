/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { spread } from '../verbs/spread.js'
import { TestStore } from './TestStore.js'

describe('test for spread verb', () => {
	test('spread test without to argument', () => {
		const step: Step = {
			verb: Verb.Spread,
			input: 'table6',
			output: 'output',
			args: {
				column: ['ID'],
			},
		}

		const store = new TestStore()

		return spread(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(6)
			expect(result.table.get('ID_1', 0)).toBe(1)
		})
	})
})
