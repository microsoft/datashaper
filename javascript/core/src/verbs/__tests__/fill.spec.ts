/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { fillStep } from '../fill.js'

describe('test for fill verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('fill test with string value', async () => {
		const result = await fillStep(store.table(), {
			to: 'newColumn',
			value: 'false',
		})

		// added one new column
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)

		// spot-check the fill value
		expect(result.get('newColumn', 0)).toBe('false')
		expect(result.get('newColumn', 1)).toBe('false')
		expect(result.get('newColumn', 2)).toBe('false')
		expect(result.get('newColumn', 3)).toBe('false')
		expect(result.get('newColumn', 4)).toBe('false')
	})

	test('fill test with number value', async () => {
		const result = await fillStep(store.table(), { to: 'newColumn', value: 20 })

		// added one new column
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)

		// spot-check the fill value
		expect(result.get('newColumn', 0)).toBe(20)
		expect(result.get('newColumn', 1)).toBe(20)
		expect(result.get('newColumn', 2)).toBe(20)
		expect(result.get('newColumn', 3)).toBe(20)
		expect(result.get('newColumn', 4)).toBe(20)
	})
})
