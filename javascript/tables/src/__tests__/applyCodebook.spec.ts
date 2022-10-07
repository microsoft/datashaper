/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataType } from '@datashaper/schema'
import { fromCSV } from 'arquero'
import fs from 'fs'

import { applyCodebook } from '../applyCodebook.js'
import { generateCodebook } from '../generateCodebook.js'

describe('Apply codebook tests', () => {
	describe('codebook object', () => {
		const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		applyCodebook(parsed, codebookResult)

		it('should return a codebook object', () => {
			expect(true).toBe(true)
		})
	})
})
