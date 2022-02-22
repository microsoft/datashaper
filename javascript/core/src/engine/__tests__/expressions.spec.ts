/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	FilterCompareType,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '../../types.js'
import { compare } from '../util/expressions.js'

describe('test-expressions', () => {
	test('numeric value equals', () => {
		const { expr } = compare(
			'count',
			1,
			NumericComparisonOperator.Eq,
			FilterCompareType.Value,
		)

		expect(
			expr({
				count: 0,
			}),
		).toBe(0)

		expect(
			expr({
				count: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 2,
			}),
		).toBe(0)

		expect(
			expr({
				count: 3,
			}),
		).toBe(0)
	})

	test('numeric value gt', () => {
		const { expr } = compare(
			'count',
			1,
			NumericComparisonOperator.Gt,
			FilterCompareType.Value,
		)

		expect(
			expr({
				count: 0,
			}),
		).toBe(0)

		expect(
			expr({
				count: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 2,
			}),
		).toBe(1)

		expect(
			expr({
				count: 3,
			}),
		).toBe(1)
	})

	test('numeric value gte', () => {
		const { expr } = compare(
			'count',
			1,
			NumericComparisonOperator.Gte,
			FilterCompareType.Value,
		)

		expect(
			expr({
				count: 0,
			}),
		).toBe(0)

		expect(
			expr({
				count: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 2,
			}),
		).toBe(1)

		expect(
			expr({
				count: 3,
			}),
		).toBe(1)
	})

	test('numeric value lt', () => {
		const { expr } = compare(
			'count',
			1,
			NumericComparisonOperator.Lt,
			FilterCompareType.Value,
		)

		expect(
			expr({
				count: 0,
			}),
		).toBe(1)

		expect(
			expr({
				count: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 2,
			}),
		).toBe(0)

		expect(
			expr({
				count: 3,
			}),
		).toBe(0)
	})

	test('numeric value lte', () => {
		const { expr } = compare(
			'count',
			1,
			NumericComparisonOperator.Lte,
			FilterCompareType.Value,
		)

		expect(
			expr({
				count: 0,
			}),
		).toBe(1)

		expect(
			expr({
				count: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 2,
			}),
		).toBe(0)

		expect(
			expr({
				count: 3,
			}),
		).toBe(0)
	})

	test('numeric value NotEq', () => {
		const { expr } = compare(
			'count',
			1,
			NumericComparisonOperator.NotEq,
			FilterCompareType.Value,
		)

		expect(
			expr({
				count: 0,
			}),
		).toBe(1)

		expect(
			expr({
				count: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 2,
			}),
		).toBe(1)

		expect(
			expr({
				count: 3,
			}),
		).toBe(1)
	})

	test('numeric value NotEmpty', () => {
		const { expr } = compare(
			'count',
			1,
			NumericComparisonOperator.NotEmpty,
			FilterCompareType.Value,
		)

		expect(
			expr({
				count: 0,
			}),
		).toBe(1)

		expect(
			expr({
				count: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 2,
			}),
		).toBe(1)

		expect(
			expr({
				count: null,
			}),
		).toBe(0)
	})

	test('numeric value Empty', () => {
		const { expr } = compare(
			'count',
			1,
			NumericComparisonOperator.Empty,
			FilterCompareType.Value,
		)

		expect(
			expr({
				count: 0,
			}),
		).toBe(0)

		expect(
			expr({
				count: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 2,
			}),
		).toBe(0)

		expect(
			expr({
				count: null,
			}),
		).toBe(1)
	})

	test('string value contains', () => {
		const { expr } = compare(
			'item',
			'be',
			StringComparisonOperator.Contains,
			FilterCompareType.Value,
		)

		expect(
			expr({
				item: 'bed',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'label',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'table',
			}),
		).toBe(0)

		expect(
			expr({
				item: 'desk',
			}),
		).toBe(0)
	})

	test('string value Empty', () => {
		const { expr } = compare(
			'item',
			'',
			StringComparisonOperator.Empty,
			FilterCompareType.Value,
		)

		expect(
			expr({
				item: '',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'table',
			}),
		).toBe(0)
	})

	test('string value EndsWith', () => {
		const { expr } = compare(
			'item',
			'e',
			StringComparisonOperator.EndsWith,
			FilterCompareType.Value,
		)

		expect(
			expr({
				item: 'bed',
			}),
		).toBe(0)

		expect(
			expr({
				item: 'label',
			}),
		).toBe(0)

		expect(
			expr({
				item: 'table',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'desk',
			}),
		).toBe(0)
	})

	test('string value Equal', () => {
		const { expr } = compare(
			'item',
			'table',
			StringComparisonOperator.Equal,
			FilterCompareType.Value,
		)

		expect(
			expr({
				item: 'bed',
			}),
		).toBe(0)

		expect(
			expr({
				item: 'label',
			}),
		).toBe(0)

		expect(
			expr({
				item: 'table',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'desk',
			}),
		).toBe(0)
	})

	test('string value NotEmpty', () => {
		const { expr } = compare(
			'item',
			'',
			StringComparisonOperator.NotEmpty,
			FilterCompareType.Value,
		)

		expect(
			expr({
				item: 'label',
			}),
		).toBe(1)

		expect(
			expr({
				item: '',
			}),
		).toBe(0)
	})

	test('string value NotEq', () => {
		const { expr } = compare(
			'item',
			'table',
			StringComparisonOperator.NotEqual,
			FilterCompareType.Value,
		)

		expect(
			expr({
				item: 'bed',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'label',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'table',
			}),
		).toBe(0)

		expect(
			expr({
				item: 'desk',
			}),
		).toBe(1)
	})

	test('string value StartsWith', () => {
		const { expr } = compare(
			'item',
			'la',
			StringComparisonOperator.StartsWith,
			FilterCompareType.Value,
		)

		expect(
			expr({
				item: 'bed',
			}),
		).toBe(0)

		expect(
			expr({
				item: 'label',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'table',
			}),
		).toBe(0)

		expect(
			expr({
				item: 'desk',
			}),
		).toBe(0)
	})

	test('numeric column filter gte', () => {
		const { expr } = compare(
			'count',
			'count2',
			NumericComparisonOperator.Gte,
			FilterCompareType.Column,
		)

		expect(
			expr({
				count: 0,
				count2: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 1,
				count2: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 2,
				count2: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 3,
				count2: 1,
			}),
		).toBe(1)
	})

	test('numeric column filter gt', () => {
		const { expr } = compare(
			'count',
			'count2',
			NumericComparisonOperator.Gt,
			FilterCompareType.Column,
		)

		expect(
			expr({
				count: 0,
				count2: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 1,
				count2: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 2,
				count2: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 3,
				count2: 1,
			}),
		).toBe(1)
	})

	test('numeric column filter lt', () => {
		const { expr } = compare(
			'count',
			'count2',
			NumericComparisonOperator.Lt,
			FilterCompareType.Column,
		)

		expect(
			expr({
				count: 0,
				count2: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 1,
				count2: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 2,
				count2: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 3,
				count2: 1,
			}),
		).toBe(0)
	})

	test('numeric column filter lte', () => {
		const { expr } = compare(
			'count',
			'count2',
			NumericComparisonOperator.Lte,
			FilterCompareType.Column,
		)

		expect(
			expr({
				count: 0,
				count2: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 1,
				count2: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 2,
				count2: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 3,
				count2: 1,
			}),
		).toBe(0)
	})

	test('numeric column filter eq', () => {
		const { expr } = compare(
			'count',
			'count2',
			NumericComparisonOperator.Eq,
			FilterCompareType.Column,
		)

		expect(
			expr({
				count: 0,
				count2: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 1,
				count2: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 2,
				count2: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 3,
				count2: 1,
			}),
		).toBe(0)
	})

	test('numeric column filter notEq', () => {
		const { expr } = compare(
			'count',
			'count2',
			NumericComparisonOperator.NotEq,
			FilterCompareType.Column,
		)

		expect(
			expr({
				count: 0,
				count2: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 1,
				count2: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 2,
				count2: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 3,
				count2: 1,
			}),
		).toBe(1)
	})

	test('numeric column filter empty', () => {
		const { expr } = compare(
			'count',
			'count2',
			NumericComparisonOperator.Empty,
			FilterCompareType.Column,
		)

		expect(
			expr({
				count: null,
				count2: 1,
			}),
		).toBe(1)

		expect(
			expr({
				count: 1,
				count2: 1,
			}),
		).toBe(0)
	})

	test('numeric column filter notEmpty', () => {
		const { expr } = compare(
			'count',
			'count2',
			NumericComparisonOperator.NotEmpty,
			FilterCompareType.Column,
		)

		expect(
			expr({
				count: null,
				count2: 1,
			}),
		).toBe(0)

		expect(
			expr({
				count: 1,
				count2: 1,
			}),
		).toBe(1)
	})

	test('string column filter contains', () => {
		const { expr } = compare(
			'item',
			'item2',
			StringComparisonOperator.Contains,
			FilterCompareType.Column,
		)

		expect(
			expr({
				item: 'bed',
				item2: 'be',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'table',
				item2: 'bl',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'bed',
				item2: 'pillow',
			}),
		).toBe(0)
	})

	test('string column filter EndsWith', () => {
		const { expr } = compare(
			'item',
			'item2',
			StringComparisonOperator.EndsWith,
			FilterCompareType.Column,
		)

		expect(
			expr({
				item: 'bed',
				item2: 'd',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'bed',
				item2: 'pillow',
			}),
		).toBe(0)
	})

	test('string column filter Equal', () => {
		const { expr } = compare(
			'item',
			'item2',
			StringComparisonOperator.Equal,
			FilterCompareType.Column,
		)

		expect(
			expr({
				item: 'bed',
				item2: 'pillow',
			}),
		).toBe(0)

		expect(
			expr({
				item: 'bed',
				item2: 'bed',
			}),
		).toBe(1)
	})

	test('string column filter NotEq', () => {
		const { expr } = compare(
			'item',
			'item2',
			StringComparisonOperator.NotEqual,
			FilterCompareType.Column,
		)

		expect(
			expr({
				item: 'bed',
				item2: 'pillow',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'bed',
				item2: 'bed',
			}),
		).toBe(0)
	})

	test('string column filter StartsWith', () => {
		const { expr } = compare(
			'item',
			'item2',
			StringComparisonOperator.StartsWith,
			FilterCompareType.Column,
		)

		expect(
			expr({
				item: 'bed',
				item2: 'b',
			}),
		).toBe(1)

		expect(
			expr({
				item: 'bed',
				item2: 'e',
			}),
		).toBe(0)

		expect(
			expr({
				item: 'bed',
				item2: 'd',
			}),
		).toBe(0)
	})

	test('boolean value with equals', () => {
		const { expr } = compare(
			'flag',
			'true',
			NumericComparisonOperator.Eq,
			FilterCompareType.Value,
		)

		expect(
			expr({
				flag: true,
			}),
		).toBe(1)

		expect(
			expr({
				flag: false,
			}),
		).toBe(0)
	})

	test('boolean value with not equals', () => {
		const { expr } = compare(
			'flag',
			'true',
			NumericComparisonOperator.NotEq,
			FilterCompareType.Value,
		)

		expect(
			expr({
				flag: true,
			}),
		).toBe(0)

		expect(
			expr({
				flag: false,
			}),
		).toBe(1)
	})
})
