/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FilterCompareType, NumericComparisonOperator } from '../../index.js'
import type { BinarizeStep } from '../../types.js'
import { StringComparisonOperator, Verb } from '../../types.js'
import { binarize } from '../verbs/binarize.js'
import { TestStore } from './TestStore.js'

describe('test for binarize verb', () => {
	test('binarize test with NumericComparisonOperator Gte', () => {
		const step: BinarizeStep = {
			verb: Verb.Binarize,
			input: 'table1',
			output: 'output',
			args: {
				to: 'newColumn',
				column: 'count',
				criteria: [
					{
						operator: NumericComparisonOperator.GreaterThanOrEqual,
						type: FilterCompareType.Value,
						value: 40,
					},
				],
			},
		}

		const store = new TestStore()

		return binarize(step, store).then(result => {
			// one new column
			expect(result.table!.numCols()).toBe(4)
			// no new rows
			expect(result.table!.numRows()).toBe(5)
			// test where criteria match
			expect(result.table!.get('newColumn', 0)).toBe(0)
			expect(result.table!.get('newColumn', 1)).toBe(0)
			expect(result.table!.get('newColumn', 2)).toBe(0)
			expect(result.table!.get('newColumn', 3)).toBe(1)
			expect(result.table!.get('newColumn', 4)).toBe(1)
		})
	})

	test('binarize test with NumericComparisonOperator Gt', () => {
		const step: BinarizeStep = {
			verb: Verb.Binarize,
			input: 'table1',
			output: 'output',
			args: {
				to: 'newColumn',
				column: 'count',
				criteria: [
					{
						operator: NumericComparisonOperator.GreaterThan,
						type: FilterCompareType.Value,
						value: 40,
					},
				],
			},
		}

		const store = new TestStore()

		return binarize(step, store).then(result => {
			// one new column
			expect(result.table!.numCols()).toBe(4)
			// no new rows
			expect(result.table!.numRows()).toBe(5)
			// test where criteria match
			expect(result.table!.get('newColumn', 0)).toBe(0)
			expect(result.table!.get('newColumn', 1)).toBe(0)
			expect(result.table!.get('newColumn', 2)).toBe(0)
			expect(result.table!.get('newColumn', 3)).toBe(0)
			expect(result.table!.get('newColumn', 4)).toBe(1)
		})
	})

	test('binarize test with NumericComparisonOperator Lt', () => {
		const step: BinarizeStep = {
			verb: Verb.Binarize,
			input: 'table1',
			output: 'output',
			args: {
				to: 'newColumn',
				column: 'count',
				criteria: [
					{
						operator: NumericComparisonOperator.LessThan,
						type: FilterCompareType.Value,
						value: 40,
					},
				],
			},
		}

		const store = new TestStore()

		return binarize(step, store).then(result => {
			// one new column
			expect(result.table!.numCols()).toBe(4)
			// no new rows
			expect(result.table!.numRows()).toBe(5)
			// test where criteria match
			expect(result.table!.get('newColumn', 0)).toBe(1)
			expect(result.table!.get('newColumn', 1)).toBe(1)
			expect(result.table!.get('newColumn', 2)).toBe(1)
			expect(result.table!.get('newColumn', 3)).toBe(0)
			expect(result.table!.get('newColumn', 4)).toBe(0)
		})
	})

	test('binarize test with StringComparisonOperator EndsWith', () => {
		const step: BinarizeStep = {
			verb: Verb.Binarize,
			input: 'table4',
			output: 'output',
			args: {
				to: 'newColumn',
				column: 'item',
				criteria: [
					{
						operator: StringComparisonOperator.EndsWith,
						type: FilterCompareType.Value,
						value: 'a',
					},
				],
			},
		}

		const store = new TestStore()

		return binarize(step, store).then(result => {
			// one new column
			expect(result.table!.numCols()).toBe(4)
			// no new rows
			expect(result.table!.numRows()).toBe(6)
			// test where criteria match
			expect(result.table!.get('newColumn', 0)).toBe(0)
			expect(result.table!.get('newColumn', 1)).toBe(0)
			expect(result.table!.get('newColumn', 2)).toBe(1)
			expect(result.table!.get('newColumn', 3)).toBe(1)
			expect(result.table!.get('newColumn', 4)).toBe(0)
			expect(result.table!.get('newColumn', 5)).toBe(0)
		})
	})

	test('binarize test with StringComparisonOperator Empty', () => {
		const step: BinarizeStep = {
			verb: Verb.Binarize,
			input: 'table5',
			output: 'output',
			args: {
				to: 'newColumn',
				column: 'item',
				criteria: [
					{
						operator: StringComparisonOperator.IsEmpty,
						type: FilterCompareType.Value,
					},
				],
			},
		}

		const store = new TestStore()

		return binarize(step, store).then(result => {
			// one new column
			expect(result.table!.numCols()).toBe(4)
			// no new rows
			expect(result.table!.numRows()).toBe(6)
			// test where criteria match
			expect(result.table!.get('newColumn', 0)).toBe(0)
			expect(result.table!.get('newColumn', 1)).toBe(1)
			expect(result.table!.get('newColumn', 2)).toBe(0)
			expect(result.table!.get('newColumn', 3)).toBe(0)
			expect(result.table!.get('newColumn', 4)).toBe(0)
			expect(result.table!.get('newColumn', 5)).toBe(1)
		})
	})

	test('binarize test with StringComparisonOperator Contains', () => {
		const step: BinarizeStep = {
			verb: Verb.Binarize,
			input: 'table5',
			output: 'output',
			args: {
				to: 'newColumn',
				column: 'item',
				criteria: [
					{
						operator: StringComparisonOperator.Contains,
						type: FilterCompareType.Value,
						value: 'so',
					},
				],
			},
		}

		const store = new TestStore()

		return binarize(step, store).then(result => {
			// one new column
			expect(result.table!.numCols()).toBe(4)
			// no new rows
			expect(result.table!.numRows()).toBe(6)
			// test where criteria match
			expect(result.table!.get('newColumn', 0)).toBe(0)
			expect(result.table!.get('newColumn', 1)).toBeNull()
			expect(result.table!.get('newColumn', 2)).toBe(1)
			expect(result.table!.get('newColumn', 3)).toBe(1)
			expect(result.table!.get('newColumn', 4)).toBe(0)
			expect(result.table!.get('newColumn', 5)).toBeNull()
		})
	})

	test('binarize test with StringComparisonOperator Contains and two criteria', () => {
		const step: BinarizeStep = {
			verb: Verb.Binarize,
			input: 'table5',
			output: 'output',
			args: {
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
			},
		}

		const store = new TestStore()

		return binarize(step, store).then(result => {
			// one new column
			expect(result.table!.numCols()).toBe(4)
			// no new rows
			expect(result.table!.numRows()).toBe(6)
			// test where criteria match
			expect(result.table!.get('newColumn', 0)).toBe(1)
			expect(result.table!.get('newColumn', 1)).toBeNull()
			expect(result.table!.get('newColumn', 2)).toBe(1)
			expect(result.table!.get('newColumn', 3)).toBe(1)
			expect(result.table!.get('newColumn', 4)).toBe(0)
			expect(result.table!.get('newColumn', 5)).toBeNull()
		})
	})
})
