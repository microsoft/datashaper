/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import merge from 'lodash-es/merge.js'

import type { Step } from '../../types.js'
import { BooleanLogicalOperator, Verb } from '../../types.js'
import { boolean } from '../boolean.js'
import { TestStore } from './TestStore.js'

describe('test for boolean verb', () => {
	const base: Step = {
		verb: Verb.Boolean,
		input: 'table20',
		output: 'output',
		args: {
			to: 'newColumn',
			columns: ['A', 'B', 'C'],
		},
	}

	test('OR', () => {
		const step = merge(
			{
				args: {
					operator: BooleanLogicalOperator.OR,
				},
			},
			base,
		)

		const store = new TestStore()

		return boolean(step, store).then(result => {
			expect(result.table!.numCols()).toBe(5)
			expect(result.table!.numRows()).toBe(4)
			expect(result.table!.get('newColumn', 0)).toBe(1)
			expect(result.table!.get('newColumn', 1)).toBe(1)
			expect(result.table!.get('newColumn', 2)).toBe(1)
			expect(result.table!.get('newColumn', 3)).toBe(0)
		})
	})

	test('AND', () => {
		const step = merge(
			{
				args: {
					operator: BooleanLogicalOperator.AND,
				},
			},
			base,
		)

		const store = new TestStore()

		return boolean(step, store).then(result => {
			expect(result.table!.numCols()).toBe(5)
			expect(result.table!.numRows()).toBe(4)
			expect(result.table!.get('newColumn', 0)).toBe(1)
			expect(result.table!.get('newColumn', 1)).toBe(0)
			expect(result.table!.get('newColumn', 2)).toBe(0)
			expect(result.table!.get('newColumn', 3)).toBe(0)
		})
	})

	test('XOR', () => {
		const step = merge(
			{
				args: {
					operator: BooleanLogicalOperator.XOR,
				},
			},
			base,
		)

		const store = new TestStore()

		return boolean(step, store).then(result => {
			expect(result.table!.numCols()).toBe(5)
			expect(result.table!.numRows()).toBe(4)
			expect(result.table!.get('newColumn', 0)).toBe(0)
			expect(result.table!.get('newColumn', 1)).toBe(0)
			expect(result.table!.get('newColumn', 2)).toBe(1)
			expect(result.table!.get('newColumn', 3)).toBe(0)
		})
	})

	test('NOR', () => {
		const step = merge(
			{
				args: {
					operator: BooleanLogicalOperator.NOR,
				},
			},
			base,
		)

		const store = new TestStore()

		return boolean(step, store).then(result => {
			expect(result.table!.numCols()).toBe(5)
			expect(result.table!.numRows()).toBe(4)
			expect(result.table!.get('newColumn', 0)).toBe(0)
			expect(result.table!.get('newColumn', 1)).toBe(0)
			expect(result.table!.get('newColumn', 2)).toBe(0)
			expect(result.table!.get('newColumn', 3)).toBe(1)
		})
	})

	test('NAND', () => {
		const step = merge(
			{
				args: {
					operator: BooleanLogicalOperator.NAND,
				},
			},
			base,
		)

		const store = new TestStore()

		return boolean(step, store).then(result => {
			expect(result.table!.numCols()).toBe(5)
			expect(result.table!.numRows()).toBe(4)
			expect(result.table!.get('newColumn', 0)).toBe(0)
			expect(result.table!.get('newColumn', 1)).toBe(1)
			expect(result.table!.get('newColumn', 2)).toBe(1)
			expect(result.table!.get('newColumn', 3)).toBe(1)
		})
	})
})
