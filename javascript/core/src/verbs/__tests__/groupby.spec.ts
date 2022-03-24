/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { groupbyStep } from '../stepFunctions/simpleSteps.js'
import { TestStore } from './TestStore.js'

describe('test for groupby verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('groupby test', () => {
		const result = groupbyStep(store.table('table1'), {
			columns: ['ID'],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(5)
	})
})
