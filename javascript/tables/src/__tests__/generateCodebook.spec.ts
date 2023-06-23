/*?
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataType, VariableNature } from '@datashaper/schema'
import fs from 'fs'

import { fromCSV } from '../fromCSV.js'
import { generateCodebook } from '../generateCodebook.js'

describe('generateCodebook', () => {
	describe('small codebook', () => {
		const csv = fs.readFileSync('./src/__tests__/data/simple-example.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		// we are not autotyping here to confirm that our codebook generation correctly
		// infers types from the string values, using the pandas-compatible type hints

		it('should return a codebook object', async () => {
			const parsed = await fromCSV(csv, { autoType: false })
			const codebook = await generateCodebook(parsed)

			expect(codebook.fields).toHaveLength(8)
			expect(codebook.fields[0]?.name).toBe('index')
			expect(codebook.fields[0]?.type).toBe(DataType.Number)
			expect(codebook.fields[0]?.nature).toBe(VariableNature.Ordinal)

			expect(codebook.fields[1]?.name).toBe('int')
			expect(codebook.fields[1]?.type).toBe(DataType.Number)
			expect(codebook.fields[1]?.nature).toBe(VariableNature.Discrete)

			expect(codebook.fields[2]?.name).toBe('float')
			expect(codebook.fields[2]?.type).toBe(DataType.Number)
			expect(codebook.fields[2]?.nature).toBe(VariableNature.Continuous)

			expect(codebook.fields[3]?.name).toBe('boolean')
			expect(codebook.fields[3]?.type).toBe(DataType.Boolean)
			expect(codebook.fields[3]?.nature).toBe(VariableNature.Binary)

			expect(codebook.fields[4]?.name).toBe('string')
			expect(codebook.fields[4]?.type).toBe(DataType.String)
			expect(codebook.fields[4]?.nature).toBe(VariableNature.Nominal)

			expect(codebook.fields[5]?.name).toBe('date')
			// note that these dates are not being detected as such
			expect(codebook.fields[5]?.type).toBe(DataType.String)
			expect(codebook.fields[5]?.nature).toBe(VariableNature.Nominal)

			expect(codebook.fields[6]?.name).toBe('array')
			expect(codebook.fields[6]?.type).toBe(DataType.Array)
			expect(codebook.fields[6]?.subtype).toBe(DataType.String)
			expect(codebook.fields[6]?.nature).toBeUndefined()

			expect(codebook.fields[7]?.name).toBe('obj')
			expect(codebook.fields[7]?.type).toBe(DataType.Object)
			expect(codebook.fields[7]?.nature).toBe(VariableNature.Continuous)
		})

		describe('stocks codebook', () => {
			const csv = fs.readFileSync('./src/__tests__/data/stocks.csv', {
				encoding: 'utf8',
				flag: 'r',
			})

			it('should return a codebook object', async () => {
				const parsed = await fromCSV(csv, { autoType: false })
				const codebook = await generateCodebook(parsed)
				expect(codebook.fields).toHaveLength(9)
				expect(codebook.fields[0]?.name).toBe('Symbol')
				expect(codebook.fields[0]?.type).toBe(DataType.String)
				expect(codebook.fields[0]?.nature).toBe(VariableNature.Nominal)

				expect(codebook.fields[1]?.name).toBe('Date')
				expect(codebook.fields[1]?.type).toBe(DataType.Date)
				expect(codebook.fields[1]?.nature).toBe(VariableNature.Continuous)

				expect(codebook.fields[2]?.name).toBe('Close')
				expect(codebook.fields[2]?.type).toBe(DataType.Number)
				expect(codebook.fields[2]?.nature).toBe(VariableNature.Continuous)

				expect(codebook.fields[3]?.name).toBe('Volume')
				expect(codebook.fields[3]?.type).toBe(DataType.Number)
				expect(codebook.fields[3]?.nature).toBe(VariableNature.Discrete)

				expect(codebook.fields[4]?.name).toBe('Open')
				expect(codebook.fields[4]?.type).toBe(DataType.Number)
				expect(codebook.fields[4]?.nature).toBe(VariableNature.Continuous)

				expect(codebook.fields[5]?.name).toBe('High')
				expect(codebook.fields[5]?.type).toBe(DataType.Number)
				expect(codebook.fields[5]?.nature).toBe(VariableNature.Continuous)

				expect(codebook.fields[6]?.name).toBe('Low')
				expect(codebook.fields[6]?.type).toBe(DataType.Number)
				expect(codebook.fields[6]?.nature).toBe(VariableNature.Continuous)

				expect(codebook.fields[7]?.name).toBe('Week')
				expect(codebook.fields[7]?.type).toBe(DataType.Number)
				expect(codebook.fields[7]?.nature).toBe(VariableNature.Discrete)

				expect(codebook.fields[8]?.name).toBe('Month')
				expect(codebook.fields[8]?.type).toBe(DataType.Number)
				expect(codebook.fields[8]?.nature).toBe(VariableNature.Discrete)
			})
		})
	})

	describe('array subtypes', () => {
		const csv = fs.readFileSync('./src/__tests__/data/array.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		it('should discover array subtypes', async () => {
			// we are not autotyping here to confirm that our codebook generation correctly
			// infers types from the string values, using the pandas-compatible type hints
			const parsed = await fromCSV(csv, { autoType: false })
			const codebook = await generateCodebook(parsed)

			expect(codebook.fields).toHaveLength(3)
			expect(codebook.fields[0]?.name).toBe('id')
			expect(codebook.fields[0]?.type).toBe(DataType.Number)
			expect(codebook.fields[0]?.nature).toBe(VariableNature.Ordinal)

			expect(codebook.fields[1]?.name).toBe('numbers')
			expect(codebook.fields[1]?.type).toBe(DataType.Array)
			expect(codebook.fields[1]?.subtype).toBe(DataType.Number)
			expect(codebook.fields[1]?.nature).toBeUndefined()

			expect(codebook.fields[2]?.name).toBe('booleans')
			expect(codebook.fields[2]?.type).toBe(DataType.Array)
			expect(codebook.fields[2]?.subtype).toBe(DataType.Boolean)
			expect(codebook.fields[2]?.nature).toBeUndefined()
		})
	})
})
