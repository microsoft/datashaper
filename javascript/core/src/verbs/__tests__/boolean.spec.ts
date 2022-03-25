/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { booleanStep } from '../boolean.js'
import { BooleanOperator } from '../types.js'

describe('test for boolean verb', () => {
	const args = {
		to: 'newColumn',
		columns: ['A', 'B', 'C'],
	}
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table20')
	})

	test('OR', () => {
		const result = booleanStep(store.table(), {
			...args,
			operator: BooleanOperator.OR,
		})

		expect(result.numCols()).toBe(5)
		expect(result.numRows()).toBe(4)
		expect(result.get('newColumn', 0)).toBe(1)
		expect(result.get('newColumn', 1)).toBe(1)
		expect(result.get('newColumn', 2)).toBe(1)
		expect(result.get('newColumn', 3)).toBe(0)
	})

	test('AND', () => {
		const result = booleanStep(store.table(), {
			...args,
			operator: BooleanOperator.AND,
		})

		expect(result.numCols()).toBe(5)
		expect(result.numRows()).toBe(4)
		expect(result.get('newColumn', 0)).toBe(1)
		expect(result.get('newColumn', 1)).toBe(0)
		expect(result.get('newColumn', 2)).toBe(0)
		expect(result.get('newColumn', 3)).toBe(0)
	})

	test('XOR', () => {
		const result = booleanStep(store.table(), {
			...args,
			operator: BooleanOperator.XOR,
		})

		expect(result.numCols()).toBe(5)
		expect(result.numRows()).toBe(4)
		expect(result.get('newColumn', 0)).toBe(0)
		expect(result.get('newColumn', 1)).toBe(0)
		expect(result.get('newColumn', 2)).toBe(1)
		expect(result.get('newColumn', 3)).toBe(0)
	})

	test('NOR', () => {
		const result = booleanStep(store.table(), {
			...args,
			operator: BooleanOperator.NOR,
		})

		expect(result.numCols()).toBe(5)
		expect(result.numRows()).toBe(4)
		expect(result.get('newColumn', 0)).toBe(0)
		expect(result.get('newColumn', 1)).toBe(0)
		expect(result.get('newColumn', 2)).toBe(0)
		expect(result.get('newColumn', 3)).toBe(1)
	})

	test('NAND', () => {
		const result = booleanStep(store.table(), {
			...args,
			operator: BooleanOperator.NAND,
		})

		expect(result.numCols()).toBe(5)
		expect(result.numRows()).toBe(4)
		expect(result.get('newColumn', 0)).toBe(0)
		expect(result.get('newColumn', 1)).toBe(1)
		expect(result.get('newColumn', 2)).toBe(1)
		expect(result.get('newColumn', 3)).toBe(1)
	})
})
