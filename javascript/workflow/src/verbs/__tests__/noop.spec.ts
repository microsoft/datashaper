/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { noopStep } from '../noop.js'
import { jest } from '@jest/globals'

describe('test for noop verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('noop test', () => {
		const mockedConsole = jest.spyOn(console, 'log')

		const result = noopStep(store.table('table4'), {
			message: 'Test noop verb',
		})

		expect(mockedConsole).toHaveBeenCalledWith('Test noop verb')
	})
})
