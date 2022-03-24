/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fetchStep } from '../stepFunctions/index.js'

describe('test for fetch', () => {
	test('fetch simple csv file and automax value set', async () => {
		const result = await fetchStep({
			url: 'javascript/webapp/public/data/companies.csv',
			delimiter: ',',
			autoMax: 10000,
		})

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
	})

	test('fetch simple csv file and without automax value set', async () => {
		const result = await fetchStep({
			url: 'javascript/webapp/public/data/companies.csv',
			delimiter: ',',
		})

		expect(result.numCols()).toBe(4)
		expect(result.numRows()).toBe(5)

		expect(result.get('ID', 0)).toBe('1')
		expect(result.get('Name', 0)).toBe('Microsoft')
		expect(result.get('Employees', 0)).toBe('160000')
		expect(result.get('US', 0)).toBe('true')

		expect(result.get('ID', 1)).toBe('2')
		expect(result.get('Name', 1)).toBe('Apple')
		expect(result.get('Employees', 1)).toBe('150000')
		expect(result.get('US', 1)).toBe('true')

		expect(result.get('ID', 2)).toBe('3')
		expect(result.get('Name', 2)).toBe('Google')
		expect(result.get('Employees', 2)).toBe('135000')
		expect(result.get('US', 2)).toBe('true')

		expect(result.get('ID', 3)).toBe('4')
		expect(result.get('Name', 3)).toBe('Amazon')
		expect(result.get('Employees', 3)).toBe('1250000')
		expect(result.get('US', 3)).toBe('true')

		expect(result.get('ID', 4)).toBe('5')
		expect(result.get('Name', 4)).toBe('Samsung')
		expect(result.get('Employees', 4)).toBe('270000')
		expect(result.get('US', 4)).toBe('false')
	})

	test('fetch simple json file', async () => {
		const result = await fetchStep({
			url: 'https://vega.github.io/vega/data/cars.json',
		})

		expect(result.numCols()).toBe(9)
		expect(result.numRows()).toBe(406)

		expect(result.get('Name', 0)).toBe('chevrolet chevelle malibu')
		expect(result.get('Miles_per_Gallon', 0)).toBe(18)
		expect(result.get('Cylinders', 0)).toBe(8)
		expect(result.get('Displacement', 0)).toBe(307)
		expect(result.get('Horsepower', 0)).toBe(130)
		expect(result.get('Weight_in_lbs', 0)).toBe(3504)
		expect(result.get('Acceleration', 0)).toBe(12)
		expect(result.get('Year', 0)).toBe('1970-01-01')
		expect(result.get('Origin', 0)).toBe('USA')

		expect(result.get('Name', 405)).toBe('chevy s-10')
		expect(result.get('Miles_per_Gallon', 405)).toBe(31)
		expect(result.get('Cylinders', 405)).toBe(4)
		expect(result.get('Displacement', 405)).toBe(119)
		expect(result.get('Horsepower', 405)).toBe(82)
		expect(result.get('Weight_in_lbs', 405)).toBe(2720)
		expect(result.get('Acceleration', 405)).toBe(19.4)
		expect(result.get('Year', 405)).toBe('1982-01-01')
		expect(result.get('Origin', 405)).toBe('USA')
	})
})
