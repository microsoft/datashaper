/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CodebookStrategy } from '@datashaper/schema'
import fs from 'fs'

import { applyCodebook } from '../applyCodebook.js'
import { fromCSV } from '../fromCSV.js'
import { generateCodebook } from '../generateCodebook.js'

describe('applyCodebook', () => {
	const csv1 = fs.readFileSync('./src/__tests__/data/simple-example.csv', {
		encoding: 'utf8',
		flag: 'r',
	})
	const csv2 = fs.readFileSync('./src/__tests__/data/mapping-test.csv', {
		encoding: 'utf8',
		flag: 'r',
	})
	const csv3 = fs.readFileSync('./src/__tests__/data/array.csv', {
		encoding: 'utf8',
		flag: 'r',
	})

	const simple = fromCSV(csv1, { autoType: false })
	const mapping = fromCSV(csv2, { autoType: false })
	const arrays = fromCSV(csv3, { autoType: false })

	describe('CodebookMapping.DataTypeOnly', () => {
		async function result() {
			const table = await simple
			const codebook = await generateCodebook(table)
			return applyCodebook(table, codebook, CodebookStrategy.DataTypeOnly)
		}

		it('should return a column table', async () => {
			const res = await result()
			expect(res.numRows()).toBe(10)
			expect(res.numCols()).toBe(8)
		})
		it('column types are correctly parsed', async () => {
			const res = await result()
			expect(typeof res.get('index', 0)).toBe('number')
			expect(typeof res.get('float', 0)).toBe('number')
			expect(typeof res.get('boolean', 0)).toBe('boolean')
		})
	})

	describe('CodebookMapping.DataTypeOnly (arrays)', () => {
		async function result() {
			const table = await arrays
			const codebook = await generateCodebook(table)
			return applyCodebook(table, codebook, CodebookStrategy.DataTypeOnly)
		}

		it('should return a column table', async () => {
			const res = await result()
			expect(res.numRows()).toBe(5)
			expect(res.numCols()).toBe(3)
		})
		it('column array subtypes are correctly parsed', async () => {
			const res = await result()
			expect(typeof res.get('id', 0)).toBe('number')
			expect(res.get('numbers', 0)).toEqual([1, 2, 3, 4])
			expect(res.get('booleans', 0)).toEqual([true, true, false])
		})
	})

	describe('CodebookMapping.DataTypeAndMapping', () => {
		async function result() {
			const table = await mapping
			const codebook = await generateCodebook(table)

			const element = codebook.fields.find(
				(element) => element.name === 'diagnosis',
			)

			const mappingElements: Record<number, string> = {
				0: 'heart disease',
				1: 'diabetes type I',
				2: 'diabetes type II',
				3: 'diabetes type III',
			}

			if (element) {
				element.mapping = mappingElements
			}

			const element2 = codebook.fields.find(
				(element) => element.name === 'test',
			)
			const mappingElements2: Record<number, string> = {
				0: 'Test1',
				1: 'Test2',
				2: 'Test3',
				3: 'Test4',
			}

			if (element2) {
				element2.mapping = mappingElements2
			}

			return applyCodebook(table, codebook, CodebookStrategy.DataTypeAndMapping)
		}

		it('should return a column table with mapping values', async () => {
			const res = await result()
			expect(res.numRows()).toBe(7)
			expect(res.numCols()).toBe(3)
			expect(res.get('diagnosis', 0)).toBe('heart disease')
			expect(res.get('diagnosis', 1)).toBe('heart disease')
			expect(res.get('diagnosis', 2)).toBe('diabetes type I')
			expect(res.get('diagnosis', 3)).toBe('diabetes type III')
			expect(res.get('diagnosis', 4)).toBe('diabetes type I')
			expect(res.get('diagnosis', 5)).toBe('diabetes type II')
			expect(res.get('diagnosis', 6)).toBe('diabetes type III')
			expect(res.get('test', 0)).toBe('Test1')
			expect(res.get('test', 1)).toBe('Test1')
			expect(res.get('test', 2)).toBe('Test2')
			expect(res.get('test', 3)).toBe('Test4')
			expect(res.get('test', 4)).toBe('Test2')
			expect(res.get('test', 5)).toBe('Test3')
			expect(res.get('test', 6)).toBe('Test4')
		})
	})

	describe('ignore fields marked `exclude`', () => {
		async function result() {
			const table = await simple
			const codebook = await generateCodebook(table)
			codebook.fields = codebook.fields
				.slice(0, 3)
				.map((f) => ({ ...f, exclude: true }))

			return applyCodebook(table, codebook, CodebookStrategy.DataTypeOnly)
		}

		it('should return a column table', async () => {
			const res = await result()
			expect(res.numRows()).toBe(10)
			expect(res.numCols()).toBe(5)
		})
	})
})
