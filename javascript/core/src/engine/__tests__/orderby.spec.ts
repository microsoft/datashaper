/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb, SortDirection } from '../../types.js'
import { orderby } from '../verbs/orderby.js'
import { TestStore } from './TestStore.js'

describe('test for orderby verb', () => {
	test('orderby test with SortDirection Ascending and string value', () => {
		const step: Step = {
			verb: Verb.Orderby,
			input: 'table7',
			output: 'output',
			args: {
				orders: [{ column: 'item', direction: SortDirection.Ascending }],
			},
		}

		const store = new TestStore()

		return orderby(step, store).then(result => {
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)
			expect(result.get('item', 0)).toBe('bed')
			expect(result.get('item', 1)).toBe('chair')
			expect(result.get('item', 2)).toBe('pillow')
			expect(result.get('item', 3)).toBe('sofa')
			expect(result.get('item', 4)).toBe('stool')
		})
	})

	test('orderby test with SortDirection Descending and string value', () => {
		const step: Step = {
			verb: Verb.Orderby,
			input: 'table7',
			output: 'output',
			args: {
				orders: [{ column: 'item', direction: SortDirection.Descending }],
			},
		}

		const store = new TestStore()

		return orderby(step, store).then(result => {
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)
			expect(result.get('item', 0)).toBe('stool')
			expect(result.get('item', 1)).toBe('sofa')
			expect(result.get('item', 2)).toBe('pillow')
			expect(result.get('item', 3)).toBe('chair')
			expect(result.get('item', 4)).toBe('bed')
		})
	})

	test('orderby test with SortDirection Ascending and number value', () => {
		const step: Step = {
			verb: Verb.Orderby,
			input: 'table7',
			output: 'output',
			args: {
				orders: [{ column: 'quantity', direction: SortDirection.Ascending }],
			},
		}

		const store = new TestStore()

		return orderby(step, store).then(result => {
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)
			expect(result.get('quantity', 0)).toBe(45)
			expect(result.get('quantity', 1)).toBe(50)
			expect(result.get('quantity', 2)).toBe(78)
			expect(result.get('quantity', 3)).toBe(89)
			expect(result.get('quantity', 4)).toBe(100)
		})
	})

	test('orderby test with SortDirection Descending and number value', () => {
		const step: Step = {
			verb: Verb.Orderby,
			input: 'table7',
			output: 'output',
			args: {
				orders: [{ column: 'quantity', direction: SortDirection.Descending }],
			},
		}

		const store = new TestStore()

		return orderby(step, store).then(result => {
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)
			expect(result.get('quantity', 0)).toBe(100)
			expect(result.get('quantity', 1)).toBe(89)
			expect(result.get('quantity', 2)).toBe(78)
			expect(result.get('quantity', 3)).toBe(50)
			expect(result.get('quantity', 4)).toBe(45)
		})
	})
})
