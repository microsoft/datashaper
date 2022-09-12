/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { VariableNature } from '@datashaper/schema'
import { fromCSV } from 'arquero'
import fs from 'fs'

import { inferColumnNature } from '../inferColumnNature.js'

describe('Infer column nature tests', () => {
	describe('discrete', () => {
		const csv = fs.readFileSync('./src/__tests__/data/simple-example.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: true })

		const nature = inferColumnNature(parsed, 'index')

		it('should return true', () => {
			expect(nature).toBe(VariableNature.Discrete)
		})
	})

	describe('ordinal', () => {
		const csv = fs.readFileSync('./src/__tests__/data/simple-example.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: true })

		const nature = inferColumnNature(parsed, 'index', 11)

		it('should return true', () => {
			expect(nature).toBe(VariableNature.Ordinal)
		})
	})

	describe('nominal', () => {
		const csv = fs.readFileSync('./src/__tests__/data/simple-example.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: true })

		const nature = inferColumnNature(parsed, 'float')

		it('should return true', () => {
			expect(nature).toBe(VariableNature.Nominal)
		})
	})

	describe('binary', () => {
		const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: true })

		const nature = inferColumnNature(parsed, 'US')

		it('should return true', () => {
			expect(nature).toBe(VariableNature.Binary)
		})
	})

	describe('continuous', () => {
		const csv = fs.readFileSync('./src/__tests__/data/stocks.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: true })

		const nature = inferColumnNature(parsed, 'Close')

		it('should return true', () => {
			expect(nature).toBe(VariableNature.Continuous)
		})
	})
})
