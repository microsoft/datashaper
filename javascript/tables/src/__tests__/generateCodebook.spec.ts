/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataType } from '@datashaper/schema'
import { fromCSV } from 'arquero'
import fs from 'fs'

import { generateCodebook } from '../generateCodebook.js'

describe('Generate codebook tests', () => {
	describe('codebook object', () => {
		const csv = fs.readFileSync('./src/__tests__/data/simple-example.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		it('should return a codebook object', () => {
			expect(codebookResult.fields).toHaveLength(8)
			expect(codebookResult.fields[0].name).toBe('index')
			expect(codebookResult.fields[0].type).toBe(DataType.Number)
			expect(codebookResult.fields[1].name).toBe('int')
			expect(codebookResult.fields[1].type).toBe(DataType.Number)
			expect(codebookResult.fields[2].name).toBe('float')
			expect(codebookResult.fields[2].type).toBe(DataType.Number)
			expect(codebookResult.fields[3].name).toBe('boolean')
			expect(codebookResult.fields[3].type).toBe(DataType.Boolean)
			expect(codebookResult.fields[4].name).toBe('string')
			expect(codebookResult.fields[4].type).toBe(DataType.String)
			expect(codebookResult.fields[5].name).toBe('date')
			expect(codebookResult.fields[5].type).toBe(DataType.String)
			expect(codebookResult.fields[6].name).toBe('array')
			expect(codebookResult.fields[6].type).toBe(DataType.Array)
			expect(codebookResult.fields[7].name).toBe('obj')
			expect(codebookResult.fields[7].type).toBe(DataType.Object)
		})
	})
})
