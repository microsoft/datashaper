/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { recodeStep } from '../stepFunctions/simpleSteps.js'

describe('test for recode verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('recode test with string value', () => {
		const result = recodeStep(store.table(), {
			column: 'name',
			to: 'newColumn',
			map: {
				A: 'Z',
				B: 'Y',
				C: 'X',
			},
		})

		// added one new column
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)

		// the first three should change, the last two remain the same
		const getter = result.getter('newColumn')
		expect(getter(0)).toBe('Z')
		expect(getter(1)).toBe('Y')
		expect(getter(2)).toBe('X')
		expect(getter(3)).toBe('D')
		expect(getter(4)).toBe('E')
	})
})
