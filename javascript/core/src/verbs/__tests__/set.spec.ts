/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { SetOp, Verb } from '../../types.js'
import { setWithStore } from '../../util/sets.js'
import { TestStore } from './TestStore.js'

describe('test for set util', () => {
	test('concat test', () => {
		const step: Step = {
			verb: Verb.Difference,
			input: 'table1',
			output: 'output',
			args: { others: ['table2'] },
		}

		const store = new TestStore()

		return setWithStore(step, store, SetOp.Concat).then(result => {
			// no change to column count
			expect(result.table.numCols()).toBe(3)
			// combined rows of 5 + 1
			expect(result.table.numRows()).toBe(6)
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

		return setWithStore(step, store, SetOp.Union).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(6)
			expect(result.table.get('ID', 0)).toBe(1)
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

		return setWithStore(step, store, SetOp.Intersect).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(4)
			expect(result.table.get('ID', 0)).toBe(1)
			expect(result.table.get('ID', 1)).toBe(2)
			expect(result.table.get('ID', 2)).toBe(4)
			expect(result.table.get('ID', 3)).toBe(4)
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

		return setWithStore(step, store, SetOp.Difference).then(result => {
			// no dups in table2, so output should match original
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(5)
		})
	})
})
