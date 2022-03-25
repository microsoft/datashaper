/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { windowStep, WindowFunction } from '../window.js'

describe('test for window verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('rollup test with row_number operation', () => {
		const result = windowStep(store.table('table3'), {
			to: 'row',
			column: 'ID',
			operation: WindowFunction.RowNumber,
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(6)
		expect(result.get('row', 0)).toBe(1)
		expect(result.get('row', 1)).toBe(2)
		expect(result.get('row', 2)).toBe(3)
		expect(result.get('row', 3)).toBe(4)
		expect(result.get('row', 4)).toBe(5)
		expect(result.get('row', 5)).toBe(6)
	})
})
