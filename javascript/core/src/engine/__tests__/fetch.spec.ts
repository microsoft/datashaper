/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../index.js'
import { Verb } from '../../index.js'
import { fetch } from '../verbs/fetch.js'
import { TestStore } from './TestStore.js'

describe('test for fetch', () => {
	test('fetch simple csv file', () => {
		const step: Step = {
			verb: Verb.Fetch,
			input: '',
			output: 'output',
			args: {
				url: 'javascript/webapp/public/data/companies.csv',
				delimiter: ',',
			},
		}

		const store = new TestStore()

		return fetch(step, store).then(result => {
			expect(result.table.numCols()).toBe(4)
			expect(result.table.numRows()).toBe(5)

			expect(result.table.get('ID', 0)).toBe(1)
			expect(result.table.get('Name', 0)).toBe('Microsoft')
			expect(result.table.get('Employees', 0)).toBe(160000)
			expect(result.table.get('US', 0)).toBe(true)

			expect(result.table.get('ID', 1)).toBe(2)
			expect(result.table.get('Name', 1)).toBe('Apple')
			expect(result.table.get('Employees', 1)).toBe(150000)
			expect(result.table.get('US', 1)).toBe(true)

			expect(result.table.get('ID', 2)).toBe(3)
			expect(result.table.get('Name', 2)).toBe('Google')
			expect(result.table.get('Employees', 2)).toBe(135000)
			expect(result.table.get('US', 2)).toBe(true)

			expect(result.table.get('ID', 3)).toBe(4)
			expect(result.table.get('Name', 3)).toBe('Amazon')
			expect(result.table.get('Employees', 3)).toBe(1250000)
			expect(result.table.get('US', 3)).toBe(true)

			expect(result.table.get('ID', 4)).toBe(5)
			expect(result.table.get('Name', 4)).toBe('Samsung')
			expect(result.table.get('Employees', 4)).toBe(270000)
			expect(result.table.get('US', 4)).toBe(false)
		})
	})
})
