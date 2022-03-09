/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FilterCompareType, NumericComparisonOperator } from '../../index.js'
import type { Step } from '../../types.js'
import { StringComparisonOperator, Verb } from '../../types.js'
import { filter } from '../verbs/filter.js'
import { TestStore } from './TestStore.js'

describe('test for filter verb', () => {
	test('filter test with NumericComparisonOperator Gte', () => {
		const step: Step = {
			verb: Verb.Filter,
			input: 'table8',
			output: 'output',
			args: {
				to: '',
				column: 'count',
				operator: NumericComparisonOperator.Gte,
				type: FilterCompareType.Value,
				value: 100,
			},
		}

		const store = new TestStore()

		return filter(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(3)
			expect(result.table.get('count', 0)).toBe(100)
			expect(result.table.get('count', 1)).toBe(110)
			expect(result.table.get('count', 2)).toBe(120)
		})
	})

	test('filter test with NumericComparisonOperator Gt', () => {
		const step: Step = {
			verb: Verb.Filter,
			input: 'table8',
			output: 'output',
			args: {
				to: '',
				column: 'count',
				operator: NumericComparisonOperator.Gt,
				type: FilterCompareType.Value,
				value: 100,
			},
		}

		const store = new TestStore()

		return filter(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(2)
			expect(result.table.get('count', 0)).toBe(110)
			expect(result.table.get('count', 1)).toBe(120)
		})
	})

	test('filter test with NumericComparisonOperator Lt', () => {
		const step: Step = {
			verb: Verb.Filter,
			input: 'table8',
			output: 'output',
			args: {
				to: '',
				column: 'count',
				operator: NumericComparisonOperator.Lt,
				type: FilterCompareType.Value,
				value: 100,
			},
		}

		const store = new TestStore()

		return filter(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(2)
			expect(result.table.get('count', 0)).toBe(80)
			expect(result.table.get('count', 1)).toBe(90)
		})
	})

	test('filter test with StringComparisonOperator Equals', () => {
		const step: Step = {
			verb: Verb.Filter,
			input: 'table8',
			output: 'output',
			args: {
				to: '',
				column: 'name',
				operator: StringComparisonOperator.Equal,
				type: FilterCompareType.Value,
				value: 'D',
			},
		}

		const store = new TestStore()

		return filter(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('name', 0)).toBe('D')
		})
	})

	test('filter test with StringComparisonOperator Empty', () => {
		const step: Step = {
			verb: Verb.Filter,
			input: 'table5',
			output: 'output',
			args: {
				to: '',
				column: 'item',
				operator: StringComparisonOperator.Empty,
				type: FilterCompareType.Value,
			},
		}

		const store = new TestStore()

		return filter(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(2)
			expect(result.table.get('quantity', 0)).toBe(78)
			expect(result.table.get('quantity', 1)).toBe(45)
		})
	})

	test('filter test with StringComparisonOperator Contains', () => {
		const step: Step = {
			verb: Verb.Filter,
			input: 'table3',
			output: 'output',
			args: {
				to: '',
				column: 'item',
				operator: StringComparisonOperator.Contains,
				type: FilterCompareType.Value,
				value: 'be',
			},
		}

		const store = new TestStore()

		return filter(step, store).then(result => {
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('item', 0)).toBe('bed')
		})
	})
})
