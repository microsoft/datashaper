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
	test('erase numeric value', () => {
		const result = eraseStep(store.table(), { value: 4, column: 'ID' })
		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(6)
		expect(result.get('ID', 3)).toBeUndefined()
		expect(result.get('ID', 4)).toBeUndefined()
		expect(result.get('ID', 5)).toBeUndefined()
	})

	test('erase string value', () => {
		const result = eraseStep(store.table(), { value: 'sofa', column: 'item' })
		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(6)
		expect(result.get('item', 2)).toBeUndefined()
		expect(result.get('item', 3)).toBeUndefined()
	})
})
