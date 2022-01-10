/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fetch } from '../verbs/fetch'

describe('test for fetch', () => {
	test('fetch simple csv file', () => {
		return fetch('packages/webapp/public/data/companies.csv', ',').then(
			result => {
				result.print()
				expect(result.numCols()).toBe(4)
				expect(result.numRows()).toBe(5)

				expect(result.get('ID', 0)).toBe(1)
				expect(result.get('Name', 0)).toBe('Microsoft')
				expect(result.get('Employees', 0)).toBe(160000)
				expect(result.get('US', 0)).toBe(true)

				expect(result.get('ID', 1)).toBe(2)
				expect(result.get('Name', 1)).toBe('Apple')
				expect(result.get('Employees', 1)).toBe(150000)
				expect(result.get('US', 1)).toBe(true)

				expect(result.get('ID', 2)).toBe(3)
				expect(result.get('Name', 2)).toBe('Google')
				expect(result.get('Employees', 2)).toBe(135000)
				expect(result.get('US', 2)).toBe(true)

				expect(result.get('ID', 3)).toBe(4)
				expect(result.get('Name', 3)).toBe('Amazon')
				expect(result.get('Employees', 3)).toBe(1250000)
				expect(result.get('US', 3)).toBe(true)

				expect(result.get('ID', 4)).toBe(5)
				expect(result.get('Name', 4)).toBe('Samsung')
				expect(result.get('Employees', 4)).toBe(270000)
				expect(result.get('US', 4)).toBe(false)
			},
		)
	})
})
