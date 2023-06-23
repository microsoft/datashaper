/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CodebookStrategy } from '@datashaper/schema'
import fs from 'fs'

import { applyCodebook } from '../applyCodebook.js'
import { fromCSV } from '../fromCSV.js'
import { generateCodebook } from '../generateCodebook.js'
import { unapplyCodebook } from '../unapplyCodebook.js'

describe('unapply codebook tests', () => {
	describe('codebook test without mapping', () => {
		const csv = fs.readFileSync('./src/__tests__/data/simple-example.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		it('should return a column table', async () => {
			const parsed = await fromCSV(csv, { autoType: false })
			const codebookResult = await generateCodebook(parsed)
			const resultTable = applyCodebook(
				parsed,
				codebookResult,
				CodebookStrategy.DataTypeOnly,
			)

			expect(resultTable.numRows()).toBe(10)
			expect(resultTable.numCols()).toBe(8)
		})
	})

	describe('codebook test with mapping', () => {
		const csv = fs.readFileSync('./src/__tests__/data/mapping-test-2.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		it('should return a column table with mapping values', async () => {
			const parsed = await fromCSV(csv, { autoType: false })

			const codebookResult = await generateCodebook(parsed)

			const element = codebookResult.fields.find(
				(element) => element.name === 'diagnosis',
			)
			const mappingElements: Record<number, string> = {
				0: 'heart disease',
				1: 'diabetes type I',
				2: 'diabetes type II',
				3: 'diabetes type III',
			}

			if (element) element.mapping = mappingElements

			const element2 = codebookResult.fields.find(
				(element) => element.name === 'test',
			)
			const mappingElements2: Record<number, string> = {
				0: 'Test1',
				1: 'Test2',
				2: 'Test3',
				3: 'Test4',
			}

			if (element2) element2.mapping = mappingElements2

			const resultTable = unapplyCodebook(
				parsed,
				codebookResult,
				CodebookStrategy.DataTypeAndMapping,
			)
			expect(resultTable.numRows()).toBe(7)
			expect(resultTable.numCols()).toBe(3)
			expect(resultTable.get('diagnosis', 0)).toBe('0')
			expect(resultTable.get('diagnosis', 1)).toBe('0')
			expect(resultTable.get('diagnosis', 2)).toBe('1')
			expect(resultTable.get('diagnosis', 3)).toBe('3')
			expect(resultTable.get('diagnosis', 4)).toBe('1')
			expect(resultTable.get('diagnosis', 5)).toBe('2')
			expect(resultTable.get('diagnosis', 6)).toBe('3')
			expect(resultTable.get('test', 0)).toBe('0')
			expect(resultTable.get('test', 1)).toBe('0')
			expect(resultTable.get('test', 2)).toBe('1')
			expect(resultTable.get('test', 3)).toBe('3')
			expect(resultTable.get('test', 4)).toBe('1')
			expect(resultTable.get('test', 5)).toBe('2')
			expect(resultTable.get('test', 6)).toBe('3')
		})
	})
})
