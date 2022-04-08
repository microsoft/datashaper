/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { groupbyStep } from '../groupby.js'
import { ungroupStep } from '../ungroup.js'

describe('test for ungroup verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})

	test('ungroup test', async () => {
		let result = await groupbyStep(store.table('table10'), {
			columns: ['x', 'y'],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(3)

		expect(result.get('x', 0)).toBe('A')
		expect(result.get('x', 1)).toBe('B')
		expect(result.get('x', 2)).toBe('A')

		result = await ungroupStep(result)

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(3)

		expect(result.get('x', 0)).toBe('A')
		expect(result.get('x', 1)).toBe('B')
		expect(result.get('x', 2)).toBe('A')
	})
})
