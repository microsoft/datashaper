/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fillStep } from '../stepFunctions/simpleSteps.js'
import { TestStore } from './TestStore.js'

describe('test for fill verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('fill test with string value', () => {
		const result = fillStep(store.table(), { to: 'newColumn', value: 'false' })

		// added one new column
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)

		// spot-check the fill value
		expect(result.get('newColumn', 0)).toBe('false')
		expect(result.get('newColumn', 1)).toBe('false')
		expect(result.get('newColumn', 2)).toBe('false')
		expect(result.get('newColumn', 3)).toBe('false')
		expect(result.get('newColumn', 4)).toBe('false')
	})

	test('fill test with number value', () => {
		const result = fillStep(store.table(), { to: 'newColumn', value: 20 })

		// added one new column
		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)

		// spot-check the fill value
		expect(result.get('newColumn', 0)).toBe(20)
		expect(result.get('newColumn', 1)).toBe(20)
		expect(result.get('newColumn', 2)).toBe(20)
		expect(result.get('newColumn', 3)).toBe(20)
		expect(result.get('newColumn', 4)).toBe(20)
	})
})
