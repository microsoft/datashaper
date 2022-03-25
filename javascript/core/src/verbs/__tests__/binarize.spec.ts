/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { FilterCompareType, NumericComparisonOperator } from '../../index.js'
import { binarizeStep } from '../binarize.js'
import { StringComparisonOperator } from '../types.js'

describe('test for binarize verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table1')
	})

	test('binarize test with NumericComparisonOperator Gte', () => {
		const result = binarizeStep(store.table(), {
			to: 'newColumn',
			column: 'count',
			criteria: [
				{
					operator: NumericComparisonOperator.GreaterThanOrEqual,
					type: FilterCompareType.Value,
					value: 40,
				},
			],
		})
		// one new column
		expect(result.numCols()).toBe(4)
		// no new rows
		expect(result.numRows()).toBe(5)
		// test where criteria match
		expect(result.get('newColumn', 0)).toBe(0)
		expect(result.get('newColumn', 1)).toBe(0)
		expect(result.get('newColumn', 2)).toBe(0)
		expect(result.get('newColumn', 3)).toBe(1)
		expect(result.get('newColumn', 4)).toBe(1)
	})

	test('binarize test with NumericComparisonOperator Gt', () => {
		const result = binarizeStep(store.table(), {
			to: 'newColumn',
			column: 'count',
			criteria: [
				{
					operator: NumericComparisonOperator.GreaterThan,
					type: FilterCompareType.Value,
					value: 40,
				},
			],
		})

		// one new column
		expect(result.numCols()).toBe(4)
		// no new rows
		expect(result.numRows()).toBe(5)
		// test where criteria match
		expect(result.get('newColumn', 0)).toBe(0)
		expect(result.get('newColumn', 1)).toBe(0)
		expect(result.get('newColumn', 2)).toBe(0)
		expect(result.get('newColumn', 3)).toBe(0)
		expect(result.get('newColumn', 4)).toBe(1)
	})

	test('binarize test with NumericComparisonOperator Lt', () => {
		const result = binarizeStep(store.table(), {
			to: 'newColumn',
			column: 'count',
			criteria: [
				{
					operator: NumericComparisonOperator.LessThan,
					type: FilterCompareType.Value,
					value: 40,
				},
			],
		})

		// one new column
		expect(result.numCols()).toBe(4)
		// no new rows
		expect(result.numRows()).toBe(5)
		// test where criteria match
		expect(result.get('newColumn', 0)).toBe(1)
		expect(result.get('newColumn', 1)).toBe(1)
		expect(result.get('newColumn', 2)).toBe(1)
		expect(result.get('newColumn', 3)).toBe(0)
		expect(result.get('newColumn', 4)).toBe(0)
	})

	test('binarize test with StringComparisonOperator EndsWith', () => {
		const result = binarizeStep(store.table('table4'), {
			to: 'newColumn',
			column: 'item',
			criteria: [
				{
					operator: StringComparisonOperator.EndsWith,
					type: FilterCompareType.Value,
					value: 'a',
				},
			],
		})
		// one new column
		expect(result.numCols()).toBe(4)
		// no new rows
		expect(result.numRows()).toBe(6)
		// test where criteria match
		expect(result.get('newColumn', 0)).toBe(0)
		expect(result.get('newColumn', 1)).toBe(0)
		expect(result.get('newColumn', 2)).toBe(1)
		expect(result.get('newColumn', 3)).toBe(1)
		expect(result.get('newColumn', 4)).toBe(0)
		expect(result.get('newColumn', 5)).toBe(0)
	})

	test('binarize test with StringComparisonOperator Empty', () => {
		const result = binarizeStep(store.table('table5'), {
			to: 'newColumn',
			column: 'item',
			criteria: [
				{
					operator: StringComparisonOperator.IsEmpty,
					type: FilterCompareType.Value,
					value: undefined,
				},
			],
		})

		// one new column
		expect(result.numCols()).toBe(4)
		// no new rows
		expect(result.numRows()).toBe(6)
		// test where criteria match
		expect(result.get('newColumn', 0)).toBe(0)
		expect(result.get('newColumn', 1)).toBe(1)
		expect(result.get('newColumn', 2)).toBe(0)
		expect(result.get('newColumn', 3)).toBe(0)
		expect(result.get('newColumn', 4)).toBe(0)
		expect(result.get('newColumn', 5)).toBe(1)
	})

	test('binarize test with StringComparisonOperator Contains', () => {
		const result = binarizeStep(store.table('table5'), {
			to: 'newColumn',
			column: 'item',
			criteria: [
				{
					operator: StringComparisonOperator.Contains,
					type: FilterCompareType.Value,
					value: 'so',
				},
			],
		})

		// one new column
		expect(result.numCols()).toBe(4)
		// no new rows
		expect(result.numRows()).toBe(6)
		// test where criteria match
		expect(result.get('newColumn', 0)).toBe(0)
		expect(result.get('newColumn', 1)).toBe(0)
		expect(result.get('newColumn', 2)).toBe(1)
		expect(result.get('newColumn', 3)).toBe(1)
		expect(result.get('newColumn', 4)).toBe(0)
		expect(result.get('newColumn', 5)).toBe(0)
	})

	test('binarize test with StringComparisonOperator Contains and two criteria', () => {
		const result = binarizeStep(store.table('table5'), {
			to: 'newColumn',
			column: 'item',
			criteria: [
				{
					operator: StringComparisonOperator.Contains,
					type: FilterCompareType.Value,
					value: 'so',
				},
				{
					operator: StringComparisonOperator.Contains,
					type: FilterCompareType.Value,
					value: 'ed',
				},
			],
		})

		// one new column
		expect(result.numCols()).toBe(4)
		// no new rows
		expect(result.numRows()).toBe(6)
		// test where criteria match
		expect(result.get('newColumn', 0)).toBe(1)
		expect(result.get('newColumn', 1)).toBe(0)
		expect(result.get('newColumn', 2)).toBe(1)
		expect(result.get('newColumn', 3)).toBe(1)
		expect(result.get('newColumn', 4)).toBe(0)
		expect(result.get('newColumn', 5)).toBe(0)
	})
})
