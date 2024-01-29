/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */


import fs from 'fs'
import { fromCSV } from '../fromCSV.js'

describe('fromCsv', () => {
	const csv1 = fs.readFileSync('./src/__tests__/data/simple-example.csv', {
		encoding: 'utf8',
		flag: 'r',
	})
	const csv2 = fs.readFileSync('./src/__tests__/data/object.csv', {
		encoding: 'utf8',
		flag: 'r',
	})
	const csv3 = fs.readFileSync('./src/__tests__/data/array.csv', {
		encoding: 'utf8',
		flag: 'r',
	})

	const simple = fromCSV(csv1)
	const objects = fromCSV(csv2)
	const arrays = fromCSV(csv3)

	describe('basic table', () => {
		
		it('should return a column table', async () => {
			const res = await simple
			expect(res.numRows()).toBe(10)
			expect(res.numCols()).toBe(8)
		})
		it('column types are correctly parsed', async () => {
			const res = await simple
			expect(typeof res.get('index', 0)).toBe('number')
			expect(typeof res.get('float', 0)).toBe('number')
			expect(typeof res.get('boolean', 0)).toBe('boolean')
		})
	})

	describe('objects', () => {

		it('should return a column table', async () => {
			const res = await objects
			expect(res.numRows()).toBe(5)
			expect(res.numCols()).toBe(2)
		})
		it('column array subtypes are correctly parsed', async () => {
			const res = await objects
			expect(typeof res.get('id', 0)).toBe('number')
			expect(res.get('objects', 0)).toEqual({a: 1, b: 'hi', c: false})
			expect(res.get('objects', 1)).toEqual({a: 2, b: 'hello', c: true})
			expect(res.get('objects', 2)).toBeNull()
			res.print()
		})
	})

	describe('arrays', () => {

		it('should return a column table', async () => {
			const res = await arrays
			expect(res.numRows()).toBe(5)
			expect(res.numCols()).toBe(3)
		})
		it('column array subtypes are correctly parsed', async () => {
			const res = await arrays
			expect(typeof res.get('id', 0)).toBe('number')
			expect(res.get('numbers', 0)).toEqual([1, 2, 3, 4])
			expect(res.get('booleans', 0)).toEqual([true, true, false])
		})
	})

})
