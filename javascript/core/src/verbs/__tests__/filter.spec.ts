/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FilterCompareType, NumericComparisonOperator } from '../../index.js'
import { StringComparisonOperator } from '../types/enums.js'
import { filterStep } from '../stepFunctions/simpleSteps.js'
import { TestStore } from './TestStore.js'

describe('test for filter verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('filter test with NumericComparisonOperator Gte', () => {
		const result = filterStep(store.table('table8'), {
			column: 'count',
			criteria: [
				{
					operator: NumericComparisonOperator.GreaterThanOrEqual,
					type: FilterCompareType.Value,
					value: 100,
				},
			],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(3)
		expect(result.get('count', 0)).toBe(100)
		expect(result.get('count', 1)).toBe(110)
		expect(result.get('count', 2)).toBe(120)
	})

	test('filter test with NumericComparisonOperator Gt', () => {
		const result = filterStep(store.table('table8'), {
			column: 'count',
			criteria: [
				{
					operator: NumericComparisonOperator.GreaterThan,
					type: FilterCompareType.Value,
					value: 100,
				},
			],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(2)
		expect(result.get('count', 0)).toBe(110)
		expect(result.get('count', 1)).toBe(120)
	})

	test('filter test with NumericComparisonOperator Lt', () => {
		const result = filterStep(store.table('table8'), {
			column: 'count',
			criteria: [
				{
					operator: NumericComparisonOperator.LessThan,
					type: FilterCompareType.Value,
					value: 100,
				},
			],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(2)
		expect(result.get('count', 0)).toBe(80)
		expect(result.get('count', 1)).toBe(90)
	})

	test('filter test with StringComparisonOperator Equals', () => {
		const result = filterStep(store.table('table8'), {
			column: 'name',
			criteria: [
				{
					operator: StringComparisonOperator.Equals,
					type: FilterCompareType.Value,
					value: 'D',
				},
			],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(1)
		expect(result.get('name', 0)).toBe('D')
	})

	test('filter test with StringComparisonOperator Empty', () => {
		const result = filterStep(store.table('table5'), {
			column: 'item',
			criteria: [
				{
					operator: StringComparisonOperator.IsEmpty,
					type: FilterCompareType.Value,
					value: undefined,
				},
			],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(2)
		expect(result.get('quantity', 0)).toBe(78)
		expect(result.get('quantity', 1)).toBe(45)
	})

	test('filter test with StringComparisonOperator Contains', () => {
		const result = filterStep(store.table('table3'), {
			column: 'item',
			criteria: [
				{
					operator: StringComparisonOperator.Contains,
					type: FilterCompareType.Value,
					value: 'be',
				},
			],
		})

		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(1)
		expect(result.get('item', 0)).toBe('bed')
	})

	test('filter test with StringComparisonOperator Contains and two criteria', () => {
		const result = filterStep(store.table('table5'), {
			column: 'item',
			criteria: [
				{
					operator: StringComparisonOperator.Contains,
					type: FilterCompareType.Value,
					value: 'be',
				},
				{
					operator: StringComparisonOperator.Contains,
					type: FilterCompareType.Value,
					value: 'air',
				},
			],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(2)
		expect(result.get('item', 0)).toBe('bed')
		expect(result.get('item', 1)).toBe('chair')
	})
})
