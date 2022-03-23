/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb, WindowFunction } from '../../types.js'
import { window } from '../window.js'
import { TestStore } from './TestStore.js'

describe('test for window verb', () => {
	test('rollup test with row_number operation', () => {
		const step: Step = {
			verb: Verb.Window,
			input: 'table3',
			output: 'output',
			args: {
				to: 'row',
				column: 'ID',
				operation: WindowFunction.RowNumber,
			},
		}

		const store = new TestStore()

		return window(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(6)
			expect(result.table.get('row', 0)).toBe(1)
			expect(result.table.get('row', 1)).toBe(2)
			expect(result.table.get('row', 2)).toBe(3)
			expect(result.table.get('row', 3)).toBe(4)
			expect(result.table.get('row', 4)).toBe(5)
			expect(result.table.get('row', 5)).toBe(6)
		})
	})
})
