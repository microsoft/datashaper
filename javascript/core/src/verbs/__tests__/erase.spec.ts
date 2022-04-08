/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { eraseStep } from '../erase.js'

describe('test for erase verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table3')
	})
	test('erase numeric value', async () => {
		const result = await eraseStep(store.table(), { value: 4, columns: ['ID'] })
		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(6)
		expect(result.get('ID', 3)).toBeNull()
		expect(result.get('ID', 4)).toBeNull()
		expect(result.get('ID', 5)).toBeNull()
	})

	test('erase string value', async () => {
		const result = await eraseStep(store.table(), {
			value: 'sofa',
			columns: ['item'],
		})
		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(6)
		expect(result.get('item', 2)).toBeNull()
		expect(result.get('item', 3)).toBeNull()
	})
})
