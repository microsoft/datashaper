/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	BooleanComparisonOperator,
	BooleanOperator,
	FilterCompareType,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '@datashaper/schema'

import { compare, compareAll } from '../expressions.js'

describe('expressions', () => {
	describe('compare', () => {
		test('numeric value equals', () => {
			const { expr } = compare(
				'count',
				1,
				NumericComparisonOperator.Equals,
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
				NumericComparisonOperator.GreaterThan,
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
				NumericComparisonOperator.GreaterThanOrEqual,
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
				NumericComparisonOperator.LessThan,
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
				NumericComparisonOperator.LessThanOrEqual,
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
				NumericComparisonOperator.NotEqual,
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
				NumericComparisonOperator.IsNotEmpty,
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
				NumericComparisonOperator.IsEmpty,
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
				StringComparisonOperator.IsEmpty,
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
				StringComparisonOperator.Equals,
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
				StringComparisonOperator.IsNotEmpty,
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

		test('string value regex', () => {
			const { expr } = compare(
				'item',
				'(be)|(bl)',
				StringComparisonOperator.RegularExpression,
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
			).toBe(1)

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
				NumericComparisonOperator.GreaterThanOrEqual,
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
				NumericComparisonOperator.GreaterThan,
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
				NumericComparisonOperator.LessThan,
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
				NumericComparisonOperator.LessThanOrEqual,
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
				NumericComparisonOperator.Equals,
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
				NumericComparisonOperator.NotEqual,
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
				NumericComparisonOperator.IsEmpty,
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
				NumericComparisonOperator.IsNotEmpty,
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
				StringComparisonOperator.Equals,
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
				true,
				BooleanComparisonOperator.Equals,
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
				true,
				BooleanComparisonOperator.NotEqual,
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
})

describe('compareAll', () => {
	describe('boolean OR - any match is a pass', () => {
		test('one input, one match (pass)', () => {
			const { expr } = compareAll('flag', [
				{
					value: true,
					type: FilterCompareType.Value,
					operator: BooleanComparisonOperator.Equals,
				},
			])

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('two inputs, one match (pass)', () => {
			const { expr } = compareAll('flag', [
				{
					value: true,
					type: FilterCompareType.Value,
					operator: BooleanComparisonOperator.Equals,
				},
				{
					value: false,
					type: FilterCompareType.Value,
					operator: BooleanComparisonOperator.Equals,
				},
			])

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})
	})

	describe('boolean AND - all must match to pass', () => {
		test('one input, one match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.AND,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('two inputs, all match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.AND,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('two inputs, one match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.AND,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(0)
		})
	})

	describe('boolean XOR - exactly one match to pass', () => {
		const base = {
			type: FilterCompareType.Value,
			operator: BooleanComparisonOperator.Equals,
		}

		test('one input, one match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: true,
						...base,
					},
				],
				BooleanOperator.XOR,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('two inputs, one match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: true,
						...base,
					},
					{
						value: false,
						...base,
					},
				],
				BooleanOperator.XOR,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('three inputs, one match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: true,
						...base,
					},
					{
						value: false,
						...base,
					},
					{
						value: false,
						...base,
					},
				],
				BooleanOperator.XOR,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('three inputs, two matches (fail)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: true,
						...base,
					},
					{
						value: true,
						...base,
					},
					{
						value: false,
						...base,
					},
				],
				BooleanOperator.XOR,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(0)
		})
	})

	describe('boolean NOR - no match to pass', () => {
		test('one input, no match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NOR,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('two inputs, no match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NOR,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('two inputs, one match (fail)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NOR,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(0)
		})

		test('three inputs, no match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NOR,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('three inputs, one match (fail)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NOR,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(0)
		})
	})

	describe('boolean NAND - any match count less than comparison length to pass', () => {
		test('one input, no match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NAND,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('two inputs, no match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NAND,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('two inputs, one match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NAND,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('three inputs, no match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NAND,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('three inputs, one match (pass)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: false,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NAND,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(1)
		})

		test('three inputs, all match (fail)', () => {
			const { expr } = compareAll(
				'flag',
				[
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
					{
						value: true,
						type: FilterCompareType.Value,
						operator: BooleanComparisonOperator.Equals,
					},
				],
				BooleanOperator.NAND,
			)

			expect(
				expr({
					flag: true,
				}),
			).toBe(0)
		})
	})
})
