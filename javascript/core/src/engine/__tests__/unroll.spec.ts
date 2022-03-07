/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { unroll } from '../verbs/unroll.js'
import { TestStore } from './TestStore.js'

describe('test for unroll verb', () => {
	test('unroll test', () => {
		const step: Step = {
			verb: Verb.Unroll,
			input: 'table1',
			output: 'output',
			args: {
				columns: ['ID'],
			},
		}

		const store = new TestStore()

		return unroll(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(5)
		})
	})
})
