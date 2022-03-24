/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { renameStep } from '../stepFunctions/simpleSteps.js'

describe('test for rename verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})

	test('rename test', () => {
		const result = renameStep(store.table('table7'), {
			columns: {
				ID: 'uuid',
				item: 'product',
				quantity: 'amount',
				totalSale: 'total',
			},
		})

		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)
		expect(result.get('uuid', 0)).toBe(1)
		expect(result.get('product', 0)).toBe('bed')
		expect(result.get('amount', 0)).toBe(45)
		expect(result.get('total', 0)).toBe(54000)
	})
})
