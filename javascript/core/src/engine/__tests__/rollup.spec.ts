/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb, FieldAggregateOperation } from '../../types.js'
import { rollup } from '../verbs/rollup.js'
import { TestStore } from './TestStore.js'

describe('test for rollup verb', () => {
	test('rollup test with count operation', () => {
		const step: Step = {
			verb: Verb.Rollup,
			input: 'table3',
			output: 'output',
			args: {
				to: 'count',
				column: 'item',
				operation: FieldAggregateOperation.Count,
			},
		}

		const store = new TestStore()

		return rollup(step, store).then(result => {
			expect(result.table.numCols()).toBe(1)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('count', 0)).toBe(6)
		})
	})

	test('rollup test with sum operation', () => {
		const step: Step = {
			verb: Verb.Rollup,
			input: 'table4',
			output: 'output',
			args: {
				to: 'total',
				column: 'quantity',
				operation: FieldAggregateOperation.Sum,
			},
		}

		const store = new TestStore()

		return rollup(step, store).then(result => {
			expect(result.table.numCols()).toBe(1)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('total', 0)).toBe(407)
		})
	})

	test('rollup test with min operation', () => {
		const step: Step = {
			verb: Verb.Rollup,
			input: 'table4',
			output: 'output',
			args: {
				to: 'min',
				column: 'quantity',
				operation: FieldAggregateOperation.Min,
			},
		}

		const store = new TestStore()

		return rollup(step, store).then(result => {
			expect(result.table.numCols()).toBe(1)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('min', 0)).toBe(45)
		})
	})
})
