/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fetchStep } from '../fetch.js'

const CSV_URL = 'http://localhost:8080/fixtures/workflow_inputs/companies.csv'
/**
 * Keep unit test for data conversion checks
 */
describe('test for fetch', () => {
	test('fetch simple csv file and automax value set', async () => {
		const result = await fetchStep(
			{
				url: CSV_URL,
				delimiter: ',',
				autoMax: 10000,
			},
			'data',
		)

		expect(result.table?.numCols()).toBe(4)
		expect(result.table?.numRows()).toBe(5)

		expect(result.table?.get('ID', 0)).toBe(1)
		expect(result.table?.get('Name', 0)).toBe('Microsoft')
		expect(result.table?.get('Employees', 0)).toBe(160000)
		expect(result.table?.get('US', 0)).toBe(true)

		expect(result.table?.get('ID', 1)).toBe(2)
		expect(result.table?.get('Name', 1)).toBe('Apple')
		expect(result.table?.get('Employees', 1)).toBe(150000)
		expect(result.table?.get('US', 1)).toBe(true)

		expect(result.table?.get('ID', 2)).toBe(3)
		expect(result.table?.get('Name', 2)).toBe('Google')
		expect(result.table?.get('Employees', 2)).toBe(135000)
		expect(result.table?.get('US', 2)).toBe(true)

		expect(result.table?.get('ID', 3)).toBe(4)
		expect(result.table?.get('Name', 3)).toBe('Amazon')
		expect(result.table?.get('Employees', 3)).toBe(1250000)
		expect(result.table?.get('US', 3)).toBe(true)

		expect(result.table?.get('ID', 4)).toBe(5)
		expect(result.table?.get('Name', 4)).toBe('Samsung')
		expect(result.table?.get('Employees', 4)).toBe(270000)
		expect(result.table?.get('US', 4)).toBe(false)
	})

	test('fetch simple csv file and without automax value set', async () => {
		const result = await fetchStep(
			{
				url: CSV_URL,
				delimiter: ',',
			},
			'data',
		)

		expect(result.table?.numCols()).toBe(4)
		expect(result.table?.numRows()).toBe(5)

		expect(result.table?.get('ID', 0)).toBe('1')
		expect(result.table?.get('Name', 0)).toBe('Microsoft')
		expect(result.table?.get('Employees', 0)).toBe('160000')
		expect(result.table?.get('US', 0)).toBe('true')

		expect(result.table?.get('ID', 1)).toBe('2')
		expect(result.table?.get('Name', 1)).toBe('Apple')
		expect(result.table?.get('Employees', 1)).toBe('150000')
		expect(result.table?.get('US', 1)).toBe('true')

		expect(result.table?.get('ID', 2)).toBe('3')
		expect(result.table?.get('Name', 2)).toBe('Google')
		expect(result.table?.get('Employees', 2)).toBe('135000')
		expect(result.table?.get('US', 2)).toBe('true')

		expect(result.table?.get('ID', 3)).toBe('4')
		expect(result.table?.get('Name', 3)).toBe('Amazon')
		expect(result.table?.get('Employees', 3)).toBe('1250000')
		expect(result.table?.get('US', 3)).toBe('true')

		expect(result.table?.get('ID', 4)).toBe('5')
		expect(result.table?.get('Name', 4)).toBe('Samsung')
		expect(result.table?.get('Employees', 4)).toBe('270000')
		expect(result.table?.get('US', 4)).toBe('false')
	})

	test('fetch simple json file', async () => {
		const result = await fetchStep(
			{
				url: 'https://vega.github.io/vega/data/cars.json',
			},
			'data',
		)

		expect(result.table?.numCols()).toBe(9)
		expect(result.table?.numRows()).toBe(406)

		expect(result.table?.get('Name', 0)).toBe('chevrolet chevelle malibu')
		expect(result.table?.get('Miles_per_Gallon', 0)).toBe(18)
		expect(result.table?.get('Cylinders', 0)).toBe(8)
		expect(result.table?.get('Displacement', 0)).toBe(307)
		expect(result.table?.get('Horsepower', 0)).toBe(130)
		expect(result.table?.get('Weight_in_lbs', 0)).toBe(3504)
		expect(result.table?.get('Acceleration', 0)).toBe(12)
		expect(result.table?.get('Year', 0)).toBe('1970-01-01')
		expect(result.table?.get('Origin', 0)).toBe('USA')

		expect(result.table?.get('Name', 405)).toBe('chevy s-10')
		expect(result.table?.get('Miles_per_Gallon', 405)).toBe(31)
		expect(result.table?.get('Cylinders', 405)).toBe(4)
		expect(result.table?.get('Displacement', 405)).toBe(119)
		expect(result.table?.get('Horsepower', 405)).toBe(82)
		expect(result.table?.get('Weight_in_lbs', 405)).toBe(2720)
		expect(result.table?.get('Acceleration', 405)).toBe(19.4)
		expect(result.table?.get('Year', 405)).toBe('1982-01-01')
		expect(result.table?.get('Origin', 405)).toBe('USA')
	})
})
