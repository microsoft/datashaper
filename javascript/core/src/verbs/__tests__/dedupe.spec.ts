/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { dedupeStep } from '../dedupe.js'

describe('test for dedupe verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})

	test('dedupe test with column', async () => {
		const result = await dedupeStep(store.table('table3'), {
			columns: ['ID'],
		})
		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(3)
	})

	test('dedupe test without columns', async () => {
		const result = await dedupeStep(store.table('table10'), {})
		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(2)
		expect(result.get('x', 0)).toBe('A')
		expect(result.get('x', 1)).toBe('B')
		expect(result.get('y', 0)).toBe(1)
		expect(result.get('y', 1)).toBe(2)
		expect(result.get('z', 0)).toBe(4)
		expect(result.get('z', 1)).toBe(5)
	})
})
