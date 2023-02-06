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

	const simple = fromCSV(csv1, { autoType: false })
	const mapping = fromCSV(csv2, { autoType: false })

	describe('CodebookMapping.DataTypeOnly', () => {
		const codebook = generateCodebook(simple)

		const result = applyCodebook(
			simple,
			codebook,
			CodebookStrategy.DataTypeOnly,
		)

		it('should return a column table', () => {
			expect(result.numRows()).toBe(10)
			expect(result.numCols()).toBe(8)
		})
	})

	describe('CodebookMapping.DataTypeAndMapping', () => {
		const codebook = generateCodebook(mapping)

		const element = codebook.fields.find(
			(element) => element.name === 'diagnosis',
		)!

		const mappingElements: Record<number, string> = {
			0: 'heart disease',
			1: 'diabetes type I',
			2: 'diabetes type II',
			3: 'diabetes type III',
		}

		element.mapping = mappingElements

		const element2 = codebook.fields.find((element) => element.name === 'test')!
		const mappingElements2: Record<number, string> = {
			0: 'Test1',
			1: 'Test2',
			2: 'Test3',
			3: 'Test4',
		}

		element2.mapping = mappingElements2

		const result = applyCodebook(
			mapping,
			codebook,
			CodebookStrategy.DataTypeAndMapping,
		)

		it('should return a column table with mapping values', () => {
			expect(result.numRows()).toBe(7)
			expect(result.numCols()).toBe(3)
			expect(result.get('diagnosis', 0)).toBe('heart disease')
			expect(result.get('diagnosis', 1)).toBe('heart disease')
			expect(result.get('diagnosis', 2)).toBe('diabetes type I')
			expect(result.get('diagnosis', 3)).toBe('diabetes type III')
			expect(result.get('diagnosis', 4)).toBe('diabetes type I')
			expect(result.get('diagnosis', 5)).toBe('diabetes type II')
			expect(result.get('diagnosis', 6)).toBe('diabetes type III')
			expect(result.get('test', 0)).toBe('Test1')
			expect(result.get('test', 1)).toBe('Test1')
			expect(result.get('test', 2)).toBe('Test2')
			expect(result.get('test', 3)).toBe('Test4')
			expect(result.get('test', 4)).toBe('Test2')
			expect(result.get('test', 5)).toBe('Test3')
			expect(result.get('test', 6)).toBe('Test4')
		})
	})

	describe('ignore fields marked `exclude`', () => {
		const codebook = generateCodebook(simple)
		codebook.fields = codebook.fields
			.slice(0, 3)
			.map((f) => ({ ...f, exclude: true }))

		const result = applyCodebook(
			simple,
			codebook,
			CodebookStrategy.DataTypeOnly,
		)

		it('should return a column table', () => {
			expect(result.numRows()).toBe(10)
			expect(result.numCols()).toBe(5)
		})
	})
})
