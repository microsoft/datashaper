/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { rename } from '../verbs/rename.js'
import { TestStore } from './TestStore.js'

describe('test for rename verb', () => {
	test('rename test', () => {
		const step: Step = {
			verb: Verb.Rename,
			input: 'table7',
			output: 'output',
			args: {
				columns: {
					ID: 'uuid',
					item: 'product',
					quantity: 'amount',
					totalSale: 'total',
				},
			},
		}

		const store = new TestStore()

		return rename(step, store).then(result => {
			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)
			expect(result.table.get('uuid', 0)).toBe(1)
			expect(result.table.get('product', 0)).toBe('bed')
			expect(result.table.get('amount', 0)).toBe(45)
			expect(result.table.get('total', 0)).toBe(54000)
		})
	})
})
