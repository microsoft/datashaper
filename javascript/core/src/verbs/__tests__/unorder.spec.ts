/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { orderbyStep } from '../stepFunctions/orderby.js'
import { unorderStep } from '../stepFunctions/simpleSteps.js'
import { SortDirection } from '../types/enums.js'
import { TestStore } from './TestStore.js'

describe('test for unorder verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('unorder test with SortDirection Ascending and string value', () => {
		let result = orderbyStep(store.table('table7'), {
			orders: [{ column: 'item', direction: SortDirection.Ascending }],
		})

		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('item', 0)).toBe('bed')
		expect(result.get('item', 1)).toBe('chair')
		expect(result.get('item', 2)).toBe('pillow')
		expect(result.get('item', 3)).toBe('sofa')
		expect(result.get('item', 4)).toBe('stool')

		result = unorderStep(result)

		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('item', 0)).toBe('bed')
		expect(result.get('item', 1)).toBe('pillow')
		expect(result.get('item', 2)).toBe('sofa')
		expect(result.get('item', 3)).toBe('chair')
		expect(result.get('item', 4)).toBe('stool')
	})

	test('unorder test with SortDirection Descending and string value', () => {
		let result = orderbyStep(store.table('table7'), {
			orders: [{ column: 'item', direction: SortDirection.Descending }],
		})

		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('item', 0)).toBe('stool')
		expect(result.get('item', 1)).toBe('sofa')
		expect(result.get('item', 2)).toBe('pillow')
		expect(result.get('item', 3)).toBe('chair')
		expect(result.get('item', 4)).toBe('bed')

		result = unorderStep(result)
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('item', 0)).toBe('bed')
		expect(result.get('item', 1)).toBe('pillow')
		expect(result.get('item', 2)).toBe('sofa')
		expect(result.get('item', 3)).toBe('chair')
		expect(result.get('item', 4)).toBe('stool')
	})

	test('unorder test with SortDirection Ascending and number value', () => {
		let result = orderbyStep(store.table('table7'), {
			orders: [{ column: 'quantity', direction: SortDirection.Ascending }],
		})

		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('quantity', 0)).toBe(45)
		expect(result.get('quantity', 1)).toBe(50)
		expect(result.get('quantity', 2)).toBe(78)
		expect(result.get('quantity', 3)).toBe(89)
		expect(result.get('quantity', 4)).toBe(100)

		result = unorderStep(result)
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('quantity', 0)).toBe(45)
		expect(result.get('quantity', 1)).toBe(78)
		expect(result.get('quantity', 2)).toBe(100)
		expect(result.get('quantity', 3)).toBe(89)
		expect(result.get('quantity', 4)).toBe(50)
	})

	test('unorder test with SortDirection Descending and number value', () => {
		let result = orderbyStep(store.table('table7'), {
			orders: [{ column: 'quantity', direction: SortDirection.Descending }],
		})

		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('quantity', 0)).toBe(100)
		expect(result.get('quantity', 1)).toBe(89)
		expect(result.get('quantity', 2)).toBe(78)
		expect(result.get('quantity', 3)).toBe(50)
		expect(result.get('quantity', 4)).toBe(45)

		result = unorderStep(result)
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('quantity', 0)).toBe(45)
		expect(result.get('quantity', 1)).toBe(78)
		expect(result.get('quantity', 2)).toBe(100)
		expect(result.get('quantity', 3)).toBe(89)
		expect(result.get('quantity', 4)).toBe(50)
	})
})
