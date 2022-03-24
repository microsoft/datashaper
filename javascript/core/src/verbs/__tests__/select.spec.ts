/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { selectStep } from '../stepFunctions/simpleSteps.js'
import { TestStore } from './TestStore.js'

describe('test for select verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table1')
	})
	test('select test', () => {
		const result = selectStep(store.table('table7'), {
			columns: ['ID', 'item'],
		})

		expect(result.columnNames()).toEqual(['ID', 'item'])
		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(5)
	})
})
