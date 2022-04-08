/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { foldStep } from '../fold.js'
import { unfoldStep } from '../unfold.js'

describe('test for unfold verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('unfold test with one column folded', () => {
		let result = foldStep(store.table('table10'), {
			to: ['key', 'value'],
			columns: ['x'],
		})
		result = unfoldStep(result, { key: 'key', value: 'value' })

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(3)
		expect(result.get('x', 0)).toBe('A')
		expect(result.get('x', 1)).toBe('B')
		expect(result.get('x', 2)).toBe('A')
		expect(result.get('y', 0)).toBe(1)
		expect(result.get('y', 1)).toBe(2)
		expect(result.get('y', 2)).toBe(1)
		expect(result.get('z', 0)).toBe(4)
		expect(result.get('z', 1)).toBe(5)
		expect(result.get('z', 2)).toBe(4)
	})

	test('unfold test with all columns folded', () => {
		let result = foldStep(store.table('table18'), {
			to: ['key', 'value'],
			columns: ['A', 'B', 'C'],
		})
		result = unfoldStep(result, { key: 'key', value: 'value' })

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(3)
		expect(result.get('A', 0)).toBe(1)
		expect(result.get('A', 1)).toBe(3)
		expect(result.get('A', 2)).toBe(10)
		expect(result.get('B', 0)).toBe(2)
		expect(result.get('B', 1)).toBe(4)
		expect(result.get('B', 2)).toBe(20)
		expect(result.get('C', 0)).toBe(3)
		expect(result.get('C', 1)).toBe(5)
		expect(result.get('C', 2)).toBe(30)
	})

	test('unfold test with value on value column undefined', () => {
		let result = foldStep(store.table('table14'), {
			to: ['key', 'value'],
			columns: ['y', 'z'],
		})
		result = unfoldStep(result, { key: 'key', value: 'value' })

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(3)
		expect(result.get('x', 0)).toBe('A')
		expect(result.get('x', 1)).toBe('B')
		expect(result.get('x', 2)).toBe('A')
		expect(result.get('y', 0)).toBe(1)
		expect(result.get('y', 1)).toBeNull()
		expect(result.get('y', 2)).toBe(1)
		expect(result.get('z', 0)).toBe(true)
		expect(result.get('z', 1)).toBe(false)
		expect(result.get('z', 2)).toBe(false)
	})

	test('unfold test with value on value column null', () => {
		let result = foldStep(store.table('table15'), {
			to: ['key', 'value'],
			columns: ['y', 'z'],
		})
		result = unfoldStep(result, { key: 'key', value: 'value' })

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(3)
		expect(result.get('x', 0)).toBe('A')
		expect(result.get('x', 1)).toBe('B')
		expect(result.get('x', 2)).toBe('A')
		expect(result.get('y', 0)).toBeNull()
		expect(result.get('y', 1)).toBe(true)
		expect(result.get('y', 2)).toBe(false)
		expect(result.get('z', 0)).toBe(true)
		expect(result.get('z', 1)).toBe(false)
		expect(result.get('z', 2)).toBe(true)
	})
})
