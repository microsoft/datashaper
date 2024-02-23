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
		
		const mockedLog = jest.spyOn(console, 'log').mockImplementation(() => { })
		const mockedTable = jest.spyOn(console, 'table').mockImplementation(() => { })

		printStep(store.table('table4'), {
			message: 'Test print verb',
			limit: 4,
		})

		expect(mockedLog).toHaveBeenCalledWith('Test print verb')
		expect(mockedTable).toHaveBeenCalled()
	})
})
