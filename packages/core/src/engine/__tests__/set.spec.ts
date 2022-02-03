/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb, SetOp } from '../../types'
import { set } from '../util/sets'
import { TestStore } from './TestStore'

describe('test for set util', () => {
	test('concat test', () => {
		const step: Step = {
			verb: Verb.Difference,
			input: 'table1',
			output: 'output',
			args: { others: ['table2'] },
		}

		const store = new TestStore()

		return set(step, store, SetOp.Concat).then(result => {
			// no change to column count
			expect(result.numCols()).toBe(3)
			// combined rows of 5 + 1
			expect(result.numRows()).toBe(6)
		})
	})

	test('union test', () => {
		const step: Step = {
			verb: Verb.Difference,
			input: 'table1',
			output: 'output',
			args: { others: ['table2'] },
		}

		const store = new TestStore()

		return set(step, store, SetOp.Union).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(6)
			expect(result.get('ID', 0)).toBe(1)
		})
	})

	test('intersect test', () => {
		const step: Step = {
			verb: Verb.Difference,
			input: 'table4',
			output: 'output',
			args: { others: ['table5'] },
		}

		const store = new TestStore()

		return set(step, store, SetOp.Intersect).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(4)
			expect(result.get('ID', 0)).toBe(1)
			expect(result.get('ID', 1)).toBe(2)
			expect(result.get('ID', 2)).toBe(4)
			expect(result.get('ID', 3)).toBe(4)
		})
	})

	test('difference test', () => {
		const step: Step = {
			verb: Verb.Difference,
			input: 'table1',
			output: 'output',
			args: { others: ['table2'] },
		}

		const store = new TestStore()

		return set(step, store, SetOp.Difference).then(result => {
			// no dups in table2, so output should match original
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(5)
		})
	})
})
