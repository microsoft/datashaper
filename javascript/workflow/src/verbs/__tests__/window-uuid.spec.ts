/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { windowStep } from '../window.js'

describe('test for window uuid verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('window uuid test', () => {
		const result = windowStep(store.table('table4'), {
			column: 'ID',
			to: 'newColumn',
			operation: 'uuid',
		})

		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(6)
		expect(result.get('newColumn', 0)).not.toBeNull()
		expect(result.get('newColumn', 1)).not.toBeNull()
		expect(result.get('newColumn', 2)).not.toBeNull()
		expect(result.get('newColumn', 3)).not.toBeNull()
		expect(result.get('newColumn', 4)).not.toBeNull()
		expect(result.get('newColumn', 5)).not.toBeNull()
	})
})
