/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FieldAggregateRollupOperation } from '../../../../core'
import { Step, StepType, Verb } from '../../types'
import { rollup } from '../verbs/rollup'
import { TestStore } from './TestStore'

describe('test for rollup verb', () => {
	test('rollup test with count operation', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Rollup,
			input: 'table3',
			output: 'output',
			args: {
				as: 'count',
				field: 'item',
				operation: FieldAggregateRollupOperation.Count,
			},
		}

		const store = new TestStore()

		return rollup(step, store).then(result => {
			expect(result.numCols()).toBe(1)
			expect(result.numRows()).toBe(1)
			expect(result.get('count', 0)).toBe(6)
		})
	})

	test('rollup test with sum operation', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Rollup,
			input: 'table4',
			output: 'output',
			args: {
				as: 'total',
				field: 'quantity',
				operation: FieldAggregateRollupOperation.Sum,
			},
		}

		const store = new TestStore()

		return rollup(step, store).then(result => {
			expect(result.numCols()).toBe(1)
			expect(result.numRows()).toBe(1)
			expect(result.get('total', 0)).toBe(407)
		})
	})

	test('rollup test with min operation', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Rollup,
			input: 'table4',
			output: 'output',
			args: {
				as: 'min',
				field: 'quantity',
				operation: FieldAggregateRollupOperation.Min,
			},
		}

		const store = new TestStore()

		return rollup(step, store).then(result => {
			expect(result.numCols()).toBe(1)
			expect(result.numRows()).toBe(1)
			expect(result.get('min', 0)).toBe(45)
		})
	})
})
