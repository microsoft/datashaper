/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { sampleStep } from '../sample.js'

describe('test for sample verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('sample test with percentage', async () => {
		const result = await sampleStep(store.table('table6'), {
			proportion: 0.4,
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(2)
	})

	test('sample test with size', async () => {
		const result = await sampleStep(store.table('table6'), {
			size: 4,
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(4)
	})
})
