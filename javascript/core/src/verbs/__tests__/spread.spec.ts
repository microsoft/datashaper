/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { spreadStep } from '../stepFunctions/simpleSteps.js'
import { TestStore } from './TestStore.js'

describe('test for spread verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table1')
	})
	test('spread test without to argument', () => {
		const result = spreadStep(store.table('table6'), {
			column: 'ID',
			to: ['ID_1'],
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(6)
		expect(result.get('ID_1', 0)).toBe(1)
	})
})
