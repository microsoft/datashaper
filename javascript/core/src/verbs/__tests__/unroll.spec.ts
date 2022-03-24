/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { unrollStep } from '../stepFunctions/simpleSteps.js'
import { TestStore } from './TestStore.js'

describe('test for unroll verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('unroll test', () => {
		const result = unrollStep(store.table('table1'), {
			columns: ['ID'],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(5)
	})
})
