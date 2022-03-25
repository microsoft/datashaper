/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { imputeStep } from '../impute.js'

describe('test for impute verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('impute test with string value', () => {
		const result = imputeStep(store.table('table5'), {
			column: 'item',
			value: 'emptyValue',
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(6)
		expect(result.get('item', 0)).toBe('bed')
		expect(result.get('item', 1)).toBe('emptyValue')
		expect(result.get('item', 4)).toBe('chair')
		expect(result.get('item', 5)).toBe('emptyValue')
	})

	test('impute test with number value', () => {
		const result = imputeStep(store.table('table11'), {
			column: 'y',
			value: 5000,
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(3)
		expect(result.get('y', 0)).toBe(1)
		expect(result.get('y', 1)).toBe(5000)
		expect(result.get('y', 2)).toBe(1)
	})
})
