/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types'
import { fold } from '../verbs/fold'
import { unfold } from '../verbs/unfold'
import { TestStore } from './TestStore'

describe('test for unfold verb', () => {
	test('unfold test with one column folded', async () => {
		const step: Step = {
			verb: Verb.Fold,
			input: 'table10',
			output: 'newTable',
			args: { to: ['key', 'value'], columns: ['x'] },
		}

		const store = new TestStore()

		await fold(step, store).then(result => {
			store.set(result)
		})

		const step2: Step = {
			verb: Verb.Unfold,
			input: 'newTable',
			output: 'output',
			args: { key: 'key', value: 'value' },
		}

		return unfold(step2, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(3)
			expect(result.table.get('x', 0)).toBe('A')
			expect(result.table.get('x', 1)).toBe('B')
			expect(result.table.get('x', 2)).toBe('A')
			expect(result.table.get('y', 0)).toBe(1)
			expect(result.table.get('y', 1)).toBe(2)
			expect(result.table.get('y', 2)).toBe(1)
			expect(result.table.get('z', 0)).toBe(4)
			expect(result.table.get('z', 1)).toBe(5)
			expect(result.table.get('z', 2)).toBe(4)
		})
	})

	test('unfold test with all columns folded', async () => {
		const step: Step = {
			verb: Verb.Fold,
			input: 'table18',
			output: 'newTable',
			args: { to: ['key', 'value'], columns: ['A', 'B', 'C'] },
		}

		const store = new TestStore()

		await fold(step, store).then(result => {
			store.set(result)
		})

		const step2: Step = {
			verb: Verb.Unfold,
			input: 'newTable',
			output: 'output',
			args: { key: 'key', value: 'value' },
		}

		return unfold(step2, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(3)
			expect(result.table.get('A', 0)).toBe(1)
			expect(result.table.get('A', 1)).toBe(3)
			expect(result.table.get('A', 2)).toBe(10)
			expect(result.table.get('B', 0)).toBe(2)
			expect(result.table.get('B', 1)).toBe(4)
			expect(result.table.get('B', 2)).toBe(20)
			expect(result.table.get('C', 0)).toBe(3)
			expect(result.table.get('C', 1)).toBe(5)
			expect(result.table.get('C', 2)).toBe(30)
		})
	})

	test('unfold test with value on value column undefined', async () => {
		const step: Step = {
			verb: Verb.Fold,
			input: 'table14',
			output: 'newTable',
			args: { to: ['key', 'value'], columns: ['y', 'z'] },
		}

		const store = new TestStore()

		await fold(step, store).then(result => {
			store.set(result)
		})

		const step2: Step = {
			verb: Verb.Unfold,
			input: 'newTable',
			output: 'output',
			args: { key: 'key', value: 'value' },
		}

		return unfold(step2, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(3)
			expect(result.table.get('x', 0)).toBe('A')
			expect(result.table.get('x', 1)).toBe('B')
			expect(result.table.get('x', 2)).toBe('A')
			expect(result.table.get('y', 0)).toBe(1)
			expect(result.table.get('y', 1)).toBeUndefined()
			expect(result.table.get('y', 2)).toBe(1)
			expect(result.table.get('z', 0)).toBe(true)
			expect(result.table.get('z', 1)).toBe(false)
			expect(result.table.get('z', 2)).toBe(false)
		})
	})

	test('unfold test with value on value column null', async () => {
		const step: Step = {
			verb: Verb.Fold,
			input: 'table15',
			output: 'newTable',
			args: { to: ['key', 'value'], columns: ['y', 'z'] },
		}

		const store = new TestStore()

		await fold(step, store).then(result => {
			store.set(result)
		})

		const step2: Step = {
			verb: Verb.Unfold,
			input: 'newTable',
			output: 'output',
			args: { key: 'key', value: 'value' },
		}

		return unfold(step2, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(3)
			expect(result.table.get('x', 0)).toBe('A')
			expect(result.table.get('x', 1)).toBe('B')
			expect(result.table.get('x', 2)).toBe('A')
			expect(result.table.get('y', 0)).toBeNull()
			expect(result.table.get('y', 1)).toBe(true)
			expect(result.table.get('y', 2)).toBe(false)
			expect(result.table.get('z', 0)).toBe(true)
			expect(result.table.get('z', 1)).toBe(false)
			expect(result.table.get('z', 2)).toBe(true)
		})
	})
})
