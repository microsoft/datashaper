/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { foldStep } from '../stepFunctions/simpleSteps.js'
import { TestStore } from './TestStore.js'

describe('test for fold verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})

	test('fold test with one column', () => {
		const result = foldStep(store.table('table1'), {
			to: ['key', 'value'],
			columns: ['ID'],
		})

		// removed ID column and two new columns were added (key and value)
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)

		// spot-check the fill value
		expect(result.get('name', 0)).toBe('A')
		expect(result.get('count', 0)).toBe(10)
		expect(result.get('key', 0)).toBe('ID')
		expect(result.get('value', 0)).toBe(1)
	})

	test('fold test with two columns', () => {
		const result = foldStep(store.table('table1'), {
			to: ['key', 'value'],
			columns: ['ID', 'name'],
		})

		// removed ID column and two new columns were added (key and value)
		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(10)

		expect(result.get('count', 0)).toBe(10)
		expect(result.get('key', 0)).toBe('ID')
		expect(result.get('value', 0)).toBe(1)

		expect(result.get('count', 1)).toBe(10)
		expect(result.get('key', 1)).toBe('name')
		expect(result.get('value', 1)).toBe('A')
	})
})
