/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { unrollStep } from '../unroll.js'

describe('test for unroll verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})

	test('unroll test', async () => {
		const result = await unrollStep(store.table('table1'), {
			columns: ['ID'],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(5)
	})
})
