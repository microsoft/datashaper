/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { select } from '../verbs/select.js'
import { TestStore } from './TestStore.js'

describe('test for select verb', () => {
	test('select test', () => {
		const step: Step = {
			verb: Verb.Select,
			input: 'table7',
			output: 'output',
			args: {
				columns: ['ID', 'item'],
			},
		}

		const store = new TestStore()

		return select(step, store).then(result => {
			expect(result.table.columnNames()).toEqual(['ID', 'item'])
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(5)
		})
	})
})
