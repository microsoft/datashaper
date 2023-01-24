/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CodebookSchema, Constraints } from '@datashaper/schema'
import { ErrorCode } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import fs from 'fs'

import { fromCSV } from '../fromCSV.js'
import { generateCodebook } from '../generateCodebook.js'
import { validateTable } from '../validateTable.js'

// generates the default codebook for a table and then applies constraints we want to test
function createCodebook(
	table: ColumnTable,
	constraints: Record<string, Constraints>,
): CodebookSchema {
	const codebook = generateCodebook(table)
	Object.keys(constraints).forEach((fieldName) => {
		codebook.fields.find((field) => field.name === fieldName)!.constraints = {
			...constraints[fieldName],
		}
	})
	return codebook
}

describe('validate table', () => {
	const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
		encoding: 'utf8',
		flag: 'r',
	})
	const companies = fromCSV(csv)

	const csv2 = fs.readFileSync(
		'./src/__tests__/data/companies-missing-values.csv',
		{
			encoding: 'utf8',
			flag: 'r',
		},
	)
	const companies2 = fromCSV(csv2)

	describe('required constraint', () => {
		const codebook = createCodebook(companies2, { US: { required: true } })

		it('without indexes', () => {
			const result = validateTable(companies2, codebook)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('US')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Required)
			expect(result.errors[0]!.indexes).toBeUndefined()
		})

		it('with indexes', () => {
			const result = validateTable(companies2, codebook, true)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('US')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Required)
			expect(result.errors[0]!.indexes![0]).toBe(0)
			expect(result.errors[0]!.indexes![1]).toBe(4)
		})
	})

	describe('unique constraint', () => {
		const codebook = createCodebook(companies, { US: { unique: true } })

		it('without indexes', () => {
			const result = validateTable(companies, codebook)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('US')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Unique)
		})

		it('with indexes', () => {
			const result = validateTable(companies, codebook, true)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('US')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Unique)
			expect(result.errors[0]!.indexes![0]).toBe(1)
			expect(result.errors[0]!.indexes![1]).toBe(2)
			expect(result.errors[0]!.indexes![2]).toBe(3)
		})
	})

	describe('minLength constraint', () => {
		const codebook = createCodebook(companies, { Name: { minLength: 6 } })

		it('without indexes', () => {
			const result = validateTable(companies, codebook)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('Name')
			expect(result.errors[0]!.rule).toBe(ErrorCode.MinLength)
			expect(result.errors[0]!.indexes).toBeUndefined()
		})

		it('with indexes', () => {
			const result = validateTable(companies, codebook, true)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('Name')
			expect(result.errors[0]!.rule).toBe(ErrorCode.MinLength)
			expect(result.errors[0]!.indexes![0]).toBe(1)
		})
	})

	describe('maxLength constraint', () => {
		const codebook = createCodebook(companies, { Name: { maxLength: 5 } })

		it('without indexes', () => {
			const result = validateTable(companies, codebook)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('Name')
			expect(result.errors[0]!.rule).toBe(ErrorCode.MaxLength)
			expect(result.errors[0]!.indexes).toBeUndefined()
		})

		it('with indexes', () => {
			const result = validateTable(companies, codebook, true)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('Name')
			expect(result.errors[0]!.rule).toBe(ErrorCode.MaxLength)
			expect(result.errors[0]!.indexes).toHaveLength(4)
			expect(result.errors[0]!.indexes![0]).toBe(0)
			expect(result.errors[0]!.indexes![1]).toBe(2)
			expect(result.errors[0]!.indexes![2]).toBe(3)
			expect(result.errors[0]!.indexes![3]).toBe(4)
		})
	})

	describe('minimum constraint', () => {
		const codebook = createCodebook(companies, { ID: { minimum: 2 } })

		it('without indexes', () => {
			const result = validateTable(companies, codebook)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('ID')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Minimum)
			expect(result.errors[0]!.indexes).toBeUndefined()
		})

		it('with indexes', () => {
			const result = validateTable(companies, codebook, true)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('ID')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Minimum)
			expect(result.errors[0]!.indexes).toHaveLength(1)
			expect(result.errors[0]!.indexes![0]).toBe(0)
		})
	})

	describe('maximum constraint', () => {
		const codebook = createCodebook(companies, { ID: { maximum: 2 } })

		it('without indexes', () => {
			const result = validateTable(companies, codebook)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('ID')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Maximum)
			expect(result.errors[0]!.indexes).toBeUndefined()
		})

		it('with indexes', () => {
			const result = validateTable(companies, codebook, true)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('ID')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Maximum)
			expect(result.errors[0]!.indexes).toHaveLength(3)
			expect(result.errors[0]!.indexes![0]).toBe(2)
			expect(result.errors[0]!.indexes![1]).toBe(3)
			expect(result.errors[0]!.indexes![2]).toBe(4)
		})
	})

	describe('enum constraint', () => {
		const codebook = createCodebook(companies, {
			Name: { enum: ['Microsoft', 'Apple', 'Google'] },
		})

		it('without indexes', () => {
			const result = validateTable(companies, codebook)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('Name')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Enum)
			expect(result.errors[0]!.indexes).toBeUndefined()
		})

		it('with indexes', () => {
			const result = validateTable(companies, codebook, true)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('Name')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Enum)
			expect(result.errors[0]!.indexes).toHaveLength(2)
			expect(result.errors[0]!.indexes![0]).toBe(3)
			expect(result.errors[0]!.indexes![1]).toBe(4)
		})
	})

	describe('pattern constraint', () => {
		const codebook = createCodebook(companies, { Name: { pattern: 'Ama*' } })

		it('without indexes', () => {
			const result = validateTable(companies, codebook)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('Name')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Pattern)
			expect(result.errors[0]!.indexes).toBeUndefined()
		})

		it('with indexes', () => {
			const result = validateTable(companies, codebook, true)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0]!.name).toBe('Name')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Pattern)
			expect(result.errors[0]!.indexes).toHaveLength(4)
			expect(result.errors[0]!.indexes![0]).toBe(0)
			expect(result.errors[0]!.indexes![1]).toBe(1)
			expect(result.errors[0]!.indexes![2]).toBe(2)
			expect(result.errors[0]!.indexes![3]).toBe(4)
		})
	})

	describe('multiple constraints', () => {
		it('all fields have errors', () => {
			const codebook = createCodebook(companies, {
				ID: { required: true, unique: true, minimum: 3 },
				Name: { enum: ['Microsoft', 'Apple', 'Google'], maxLength: 5 },
			})

			const result = validateTable(companies, codebook)
			expect(result.errors).toHaveLength(3)
			expect(result.errors[0]!.name).toBe('ID')
			expect(result.errors[0]!.rule).toBe(ErrorCode.Minimum)
			expect(result.errors[1]!.name).toBe('Name')
			expect(result.errors[1]!.rule).toBe(ErrorCode.MaxLength)
			expect(result.errors[2]!.name).toBe('Name')
			expect(result.errors[2]!.rule).toBe(ErrorCode.Enum)
		})

		it('mixed errors', () => {
			const codebook = createCodebook(companies, {
				ID: { required: true, unique: true, minimum: 1, maximum: 5 },
				Name: { enum: ['Microsoft', 'Apple', 'Google'], maxLength: 5 },
			})

			const result = validateTable(companies, codebook)
			expect(result.errors).toHaveLength(2)
			expect(result.errors[0]!.name).toBe('Name')
			expect(result.errors[0]!.rule).toBe(ErrorCode.MaxLength)
			expect(result.errors[1]!.name).toBe('Name')
			expect(result.errors[1]!.rule).toBe(ErrorCode.Enum)
		})

		it('no fields have errors', () => {
			const codebook = createCodebook(companies, {
				ID: { required: true, unique: true, minimum: 1, maximum: 5 },
				Name: { maxLength: 10 },
				Employees: { minimum: 1000 },
			})

			const result = validateTable(companies, codebook)
			expect(result.errors).toHaveLength(0)
		})
	})
})
