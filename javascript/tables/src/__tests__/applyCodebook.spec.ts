/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CodebookStrategy } from '@datashaper/schema'
import { fromCSV } from 'arquero'
import fs from 'fs'

import { applyCodebook } from '../applyCodebook.js'
import { generateCodebook } from '../generateCodebook.js'

describe('Apply codebook tests', () => {
	describe('codebook test without mapping', () => {
		const csv = fs.readFileSync('./src/__tests__/data/simple-example.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		const resultTable = applyCodebook(
			parsed,
			codebookResult,
			CodebookStrategy.DataTypeOnly,
		)

		it('should return a column table', () => {
			expect(resultTable.numRows()).toBe(10)
			expect(resultTable.numCols()).toBe(8)
		})
	})

	describe('codebook test with mapping', () => {
		const csv = fs.readFileSync('./src/__tests__/data/mapping-test.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		const element = codebookResult.fields.find(
			element => element.name === 'diagnosis',
		)
		const mappingElements: Record<number, string> = {
			0: 'heart disease',
			1: 'diabetes type I',
			2: 'diabetes type II',
			3: 'diabetes type III',
		}

		element.mapping = mappingElements

		const element2 = codebookResult.fields.find(
			element => element.name === 'test',
		)
		const mappingElements2: Record<number, string> = {
			0: 'Test1',
			1: 'Test2',
			2: 'Test3',
			3: 'Test4',
		}

		element2.mapping = mappingElements2

		const resultTable = applyCodebook(
			parsed,
			codebookResult,
			CodebookStrategy.DataTypeAndMapping,
		)

		it('should return a column table with mapping values', () => {
			expect(resultTable.numRows()).toBe(7)
			expect(resultTable.numCols()).toBe(3)
			expect(resultTable.get('diagnosis', 0)).toBe('heart disease')
			expect(resultTable.get('diagnosis', 1)).toBe('heart disease')
			expect(resultTable.get('diagnosis', 2)).toBe('diabetes type I')
			expect(resultTable.get('diagnosis', 3)).toBe('diabetes type III')
			expect(resultTable.get('diagnosis', 4)).toBe('diabetes type I')
			expect(resultTable.get('diagnosis', 5)).toBe('diabetes type II')
			expect(resultTable.get('diagnosis', 6)).toBe('diabetes type III')
			expect(resultTable.get('test', 0)).toBe('Test1')
			expect(resultTable.get('test', 1)).toBe('Test1')
			expect(resultTable.get('test', 2)).toBe('Test2')
			expect(resultTable.get('test', 3)).toBe('Test4')
			expect(resultTable.get('test', 4)).toBe('Test2')
			expect(resultTable.get('test', 5)).toBe('Test3')
			expect(resultTable.get('test', 6)).toBe('Test4')
		})
	})
})
