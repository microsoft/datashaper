/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '../types/index.js'
import { orderbyStep } from '../stepFunctions/index.js'
import { TestStore } from './TestStore.js'

describe('test for orderby verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table7')
	})
	test('orderby test with SortDirection Ascending and string value', () => {
		const result = orderbyStep(store.table(), {
			orders: [{ column: 'item', direction: SortDirection.Ascending }],
		})

		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('item', 0)).toBe('bed')
		expect(result.get('item', 1)).toBe('chair')
		expect(result.get('item', 2)).toBe('pillow')
		expect(result.get('item', 3)).toBe('sofa')
		expect(result.get('item', 4)).toBe('stool')
	})

	test('orderby test with SortDirection Descending and string value', () => {
		const result = orderbyStep(store.table(), {
			orders: [{ column: 'item', direction: SortDirection.Descending }],
		})
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('item', 0)).toBe('stool')
		expect(result.get('item', 1)).toBe('sofa')
		expect(result.get('item', 2)).toBe('pillow')
		expect(result.get('item', 3)).toBe('chair')
		expect(result.get('item', 4)).toBe('bed')
	})

	test('orderby test with SortDirection Ascending and number value', () => {
		const result = orderbyStep(store.table(), {
			orders: [{ column: 'quantity', direction: SortDirection.Ascending }],
		})
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('quantity', 0)).toBe(45)
		expect(result.get('quantity', 1)).toBe(50)
		expect(result.get('quantity', 2)).toBe(78)
		expect(result.get('quantity', 3)).toBe(89)
		expect(result.get('quantity', 4)).toBe(100)
	})

	test('orderby test with SortDirection Descending and number value', () => {
		const result = orderbyStep(store.table(), {
			orders: [{ column: 'quantity', direction: SortDirection.Descending }],
		})
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('quantity', 0)).toBe(100)
		expect(result.get('quantity', 1)).toBe(89)
		expect(result.get('quantity', 2)).toBe(78)
		expect(result.get('quantity', 3)).toBe(50)
		expect(result.get('quantity', 4)).toBe(45)
	})
})
