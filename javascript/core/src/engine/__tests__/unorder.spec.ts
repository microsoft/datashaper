/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { SortDirection, Verb } from '../../types.js'
import { orderby } from '../verbs/orderby.js'
import { unorder } from '../verbs/unorder.js'
import { TestStore } from './TestStore.js'

describe('test for unorder verb', () => {
	test('unorder test with SortDirection Ascending and string value', async () => {
		const step: Step = {
			verb: Verb.Orderby,
			input: 'table7',
			output: 'newTable',
			args: {
				orders: [{ column: 'item', direction: SortDirection.Ascending }],
			},
		}

		const store = new TestStore()

		await orderby(step, store).then(result => {
			store.set(result)

			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)
			expect(result.table.get('item', 0)).toBe('bed')
			expect(result.table.get('item', 1)).toBe('chair')
			expect(result.table.get('item', 2)).toBe('pillow')
			expect(result.table.get('item', 3)).toBe('sofa')
			expect(result.table.get('item', 4)).toBe('stool')
		})

		const step2: Step = {
			verb: Verb.Unorder,
			input: 'newTable',
			output: 'output',
			args: {
				orders: [{ column: 'item', direction: SortDirection.Ascending }],
			},
		}

		return unorder(step2, store).then(result => {
			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)
			expect(result.table.get('item', 0)).toBe('bed')
			expect(result.table.get('item', 1)).toBe('pillow')
			expect(result.table.get('item', 2)).toBe('sofa')
			expect(result.table.get('item', 3)).toBe('chair')
			expect(result.table.get('item', 4)).toBe('stool')
		})
	})

	test('unorder test with SortDirection Descending and string value', async () => {
		const step: Step = {
			verb: Verb.Orderby,
			input: 'table7',
			output: 'newTable',
			args: {
				orders: [{ column: 'item', direction: SortDirection.Descending }],
			},
		}

		const store = new TestStore()

		await orderby(step, store).then(result => {
			store.set(result)

			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)
			expect(result.table.get('item', 0)).toBe('stool')
			expect(result.table.get('item', 1)).toBe('sofa')
			expect(result.table.get('item', 2)).toBe('pillow')
			expect(result.table.get('item', 3)).toBe('chair')
			expect(result.table.get('item', 4)).toBe('bed')
		})

		const step2: Step = {
			verb: Verb.Unorder,
			input: 'newTable',
			output: 'output',
			args: {
				orders: [{ column: 'item', direction: SortDirection.Descending }],
			},
		}

		return unorder(step2, store).then(result => {
			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)
			expect(result.table.get('item', 0)).toBe('bed')
			expect(result.table.get('item', 1)).toBe('pillow')
			expect(result.table.get('item', 2)).toBe('sofa')
			expect(result.table.get('item', 3)).toBe('chair')
			expect(result.table.get('item', 4)).toBe('stool')
		})
	})

	test('unorder test with SortDirection Ascending and number value', async () => {
		const step: Step = {
			verb: Verb.Orderby,
			input: 'table7',
			output: 'newTable',
			args: {
				orders: [{ column: 'quantity', direction: SortDirection.Ascending }],
			},
		}

		const store = new TestStore()

		await orderby(step, store).then(result => {
			store.set(result)

			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)
			expect(result.table.get('quantity', 0)).toBe(45)
			expect(result.table.get('quantity', 1)).toBe(50)
			expect(result.table.get('quantity', 2)).toBe(78)
			expect(result.table.get('quantity', 3)).toBe(89)
			expect(result.table.get('quantity', 4)).toBe(100)
		})

		const step2: Step = {
			verb: Verb.Unorder,
			input: 'newTable',
			output: 'output',
			args: {
				orders: [{ column: 'quantity', direction: SortDirection.Ascending }],
			},
		}

		return unorder(step2, store).then(result => {
			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)
			expect(result.table.get('quantity', 0)).toBe(45)
			expect(result.table.get('quantity', 1)).toBe(78)
			expect(result.table.get('quantity', 2)).toBe(100)
			expect(result.table.get('quantity', 3)).toBe(89)
			expect(result.table.get('quantity', 4)).toBe(50)
		})
	})

	test('unorder test with SortDirection Descending and number value', async () => {
		const step: Step = {
			verb: Verb.Orderby,
			input: 'table7',
			output: 'newTable',
			args: {
				orders: [{ column: 'quantity', direction: SortDirection.Descending }],
			},
		}

		const store = new TestStore()

		await orderby(step, store).then(result => {
			store.set(result)

			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)
			expect(result.table.get('quantity', 0)).toBe(100)
			expect(result.table.get('quantity', 1)).toBe(89)
			expect(result.table.get('quantity', 2)).toBe(78)
			expect(result.table.get('quantity', 3)).toBe(50)
			expect(result.table.get('quantity', 4)).toBe(45)
		})

		const step2: Step = {
			verb: Verb.Unorder,
			input: 'newTable',
			output: 'output',
			args: {
				orders: [{ column: 'quantity', direction: SortDirection.Descending }],
			},
		}

		return unorder(step2, store).then(result => {
			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)
			expect(result.table.get('quantity', 0)).toBe(45)
			expect(result.table.get('quantity', 1)).toBe(78)
			expect(result.table.get('quantity', 2)).toBe(100)
			expect(result.table.get('quantity', 3)).toBe(89)
			expect(result.table.get('quantity', 4)).toBe(50)
		})
	})
})
