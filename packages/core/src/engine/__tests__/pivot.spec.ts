/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FieldAggregateOperation } from '../..'
import { Step, StepType, Verb } from '../../types'
import { pivot } from '../verbs/pivot'
import { TestStore } from './TestStore'

describe('test for pivot verb', () => {
	test('pivot test with any operation', async () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Pivot,
			input: 'table16',
			output: 'output',
			args: {
				key: 'key',
				value: 'value',
				operation: FieldAggregateOperation.Any,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(1)
			expect(result.get('A', 0)).toBe(1)
			expect(result.get('B', 0)).toBe(2)
			expect(result.get('C', 0)).toBe(3)
		})
	})

	test('pivot test with sum operation', async () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Pivot,
			input: 'table17',
			output: 'output',
			args: {
				key: 'name',
				value: 'count',
				operation: FieldAggregateOperation.Sum,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(1)
			expect(result.get('A', 0)).toBe(7)
			expect(result.get('B', 0)).toBe(8)
		})
	})

	test('pivot test with max operation', async () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Pivot,
			input: 'table17',
			output: 'output',
			args: {
				key: 'name',
				value: 'count',
				operation: FieldAggregateOperation.Max,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(1)
			expect(result.get('A', 0)).toBe(4)
			expect(result.get('B', 0)).toBe(5)
		})
	})

	test('pivot test with min operation', async () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Pivot,
			input: 'table17',
			output: 'output',
			args: {
				key: 'name',
				value: 'count',
				operation: FieldAggregateOperation.Min,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(1)
			expect(result.get('A', 0)).toBe(1)
			expect(result.get('B', 0)).toBe(3)
		})
	})

	test('pivot test with mean operation', async () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Pivot,
			input: 'table17',
			output: 'output',
			args: {
				key: 'name',
				value: 'count',
				operation: FieldAggregateOperation.Mean,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(1)
			expect(result.get('A', 0)).toBe(2.3333333333333335)
			expect(result.get('B', 0)).toBe(4)
		})
	})

	test('pivot test with median operation', async () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Pivot,
			input: 'table17',
			output: 'output',
			args: {
				key: 'name',
				value: 'count',
				operation: FieldAggregateOperation.Median,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(1)
			expect(result.get('A', 0)).toBe(2)
			expect(result.get('B', 0)).toBe(4)
		})
	})
})
