/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { booleanStep } from '../stepFunctions/index.js'
import { BooleanLogicalOperator } from '../types/enums.js'
import { TestStore } from './TestStore.js'

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
			operator: BooleanLogicalOperator.OR,
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
			operator: BooleanLogicalOperator.AND,
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
			operator: BooleanLogicalOperator.XOR,
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
			operator: BooleanLogicalOperator.NOR,
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
			operator: BooleanLogicalOperator.NAND,
		})

		expect(result.numCols()).toBe(5)
		expect(result.numRows()).toBe(4)
		expect(result.get('newColumn', 0)).toBe(0)
		expect(result.get('newColumn', 1)).toBe(1)
		expect(result.get('newColumn', 2)).toBe(1)
		expect(result.get('newColumn', 3)).toBe(1)
	})
})
