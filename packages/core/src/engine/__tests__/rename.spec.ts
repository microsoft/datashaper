/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types.js'
import { rename } from '../verbs/rename'
import { TestStore } from './TestStore'

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
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)
			expect(result.get('uuid', 0)).toBe(1)
			expect(result.get('product', 0)).toBe('bed')
			expect(result.get('amount', 0)).toBe(45)
			expect(result.get('total', 0)).toBe(54000)
		})
	})
})
