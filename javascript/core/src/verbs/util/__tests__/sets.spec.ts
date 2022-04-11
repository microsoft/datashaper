/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../../__tests__/TestStore.js'
import { SetOp } from '../../types.js'
import { set } from '../sets.js'

describe('test for set util', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table1')
	})
	test('concat test', () => {
		const result = set(store.table('table1'), SetOp.Concat, [
			store.table('table2'),
		])
		// no change to column count
		expect(result.numCols()).toBe(3)
		// combined rows of 5 + 1
		expect(result.numRows()).toBe(6)
	})

	test('union test', () => {
		const result = set(store.table('table1'), SetOp.Union, [
			store.table('table2'),
		])
		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(6)
		expect(result.get('ID', 0)).toBe(1)
	})

	test('intersect test', () => {
		const result = set(store.table('table4'), SetOp.Intersect, [
			store.table('table5'),
		])
		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(4)
		expect(result.get('ID', 0)).toBe(1)
		expect(result.get('ID', 1)).toBe(2)
		expect(result.get('ID', 2)).toBe(4)
		expect(result.get('ID', 3)).toBe(4)
	})

	test('difference test', () => {
		const result = set(store.table('table1'), SetOp.Difference, [
			store.table('table2'),
		])

		// no dups in table2, so output should match original
		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(5)
	})
})
