/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { printStep } from '../print.js'
import { jest } from '@jest/globals'

describe('test for print verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('print test', () => {
		const mockedConsole = jest.spyOn(console, 'log')

		const result = printStep(store.table('table4'), {
			message: 'Test print verb',
			limit: 4,
		})

		expect(mockedConsole).toHaveBeenCalledWith('Test print verb')
	})
})
