/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Constraints , ValidationResult } from '@datashaper/schema'
import { fromCSV } from 'arquero'
import fs from 'fs'

import { generateCodebook } from '../generateCodebook.js'
import { validateTable } from '../validateTable.js'

describe('validate table tests', () => {
	describe('validate table test for required constraint', () => {
		const csv = fs.readFileSync('./src/__tests__/data/companies-2.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		const element2 = codebookResult.fields.find(
			element => element.name === 'US',
		)
		const usConstraints: Constraints = {
			required: true,
		}

		element2.constraints = usConstraints

		const validationResult: ValidationResult = validateTable(
			parsed,
			codebookResult,
		)

		it('should return a validation result object', () => {
			expect(validationResult.columnErrors).toHaveLength(1)
			expect(validationResult.columnErrors[0].columnName).toBe('US')
			expect(validationResult.columnErrors[0].rule).toBe('required')
		})
	})

	describe('validate table test for unique constraint', () => {
		const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		const element2 = codebookResult.fields.find(
			element => element.name === 'US',
		)
		const usConstraints: Constraints = {
			unique: true,
		}

		element2.constraints = usConstraints

		const validationResult: ValidationResult = validateTable(
			parsed,
			codebookResult,
		)

		it('should return a validation result object', () => {
			expect(validationResult.columnErrors).toHaveLength(1)
			expect(validationResult.columnErrors[0].columnName).toBe('US')
			expect(validationResult.columnErrors[0].rule).toBe('unique')
		})
	})

	describe('validate table test for minimum constraint', () => {
		const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		const element = codebookResult.fields.find(element => element.name === 'ID')
		const idConstraints: Constraints = {
			required: true,
			unique: true,
			minimum: 2,
		}

		element.constraints = idConstraints

		const validationResult: ValidationResult = validateTable(
			parsed,
			codebookResult,
		)

		it('should return a validation result object', () => {
			expect(validationResult.columnErrors).toHaveLength(1)
			expect(validationResult.columnErrors[0].columnName).toBe('ID')
			expect(validationResult.columnErrors[0].rule).toBe('minimum')
		})
	})

	describe('validate table test for maximum constraint', () => {
		const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		const element = codebookResult.fields.find(element => element.name === 'ID')
		const idConstraints: Constraints = {
			required: true,
			unique: true,
			maximum: 2,
		}

		element.constraints = idConstraints

		const validationResult: ValidationResult = validateTable(
			parsed,
			codebookResult,
		)

		it('should return a validation result object', () => {
			expect(validationResult.columnErrors).toHaveLength(1)
			expect(validationResult.columnErrors[0].columnName).toBe('ID')
			expect(validationResult.columnErrors[0].rule).toBe('maximum')
		})
	})

	describe('validate table test for minLength constraint', () => {
		const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		const element2 = codebookResult.fields.find(
			element => element.name === 'Name',
		)
		const nameConstraints: Constraints = {
			minLength: 6,
			enum: ['Microsoft', 'Apple', 'Google'],
		}

		element2.constraints = nameConstraints

		const validationResult: ValidationResult = validateTable(
			parsed,
			codebookResult,
		)

		it('should return a validation result object', () => {
			expect(validationResult.columnErrors).toHaveLength(1)
			expect(validationResult.columnErrors[0].columnName).toBe('Name')
			expect(validationResult.columnErrors[0].rule).toBe('minLength')
		})
	})

	describe('validate table test for maxLength constraint', () => {
		const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		const element2 = codebookResult.fields.find(
			element => element.name === 'Name',
		)
		const nameConstraints: Constraints = {
			maxLength: 5,
			enum: ['Microsoft', 'Apple', 'Google'],
		}

		element2.constraints = nameConstraints

		const validationResult: ValidationResult = validateTable(
			parsed,
			codebookResult,
		)

		it('should return a validation result object', () => {
			expect(validationResult.columnErrors).toHaveLength(1)
			expect(validationResult.columnErrors[0].columnName).toBe('Name')
			expect(validationResult.columnErrors[0].rule).toBe('maxLength')
		})
	})

	describe('validate table test for enum constraint', () => {
		const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		const element = codebookResult.fields.find(element => element.name === 'ID')
		const idConstraints: Constraints = {
			required: true,
			unique: true,
		}

		element.constraints = idConstraints

		const element2 = codebookResult.fields.find(
			element => element.name === 'Name',
		)
		const nameConstraints: Constraints = {
			enum: ['Microsoft', 'Apple', 'Google'],
		}

		element2.constraints = nameConstraints

		const validationResult: ValidationResult = validateTable(
			parsed,
			codebookResult,
		)

		it('should return a validation result object', () => {
			expect(validationResult.columnErrors).toHaveLength(1)
			expect(validationResult.columnErrors[0].columnName).toBe('Name')
			expect(validationResult.columnErrors[0].rule).toBe('enum')
		})
	})

	describe('validate table test for multiple constraints', () => {
		const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = fromCSV(csv, { autoType: false })

		const codebookResult = generateCodebook(parsed)

		const element = codebookResult.fields.find(element => element.name === 'ID')
		const idConstraints: Constraints = {
			required: true,
			unique: true,
			minimum: 3,
		}

		element.constraints = idConstraints

		const element2 = codebookResult.fields.find(
			element => element.name === 'Name',
		)
		const nameConstraints: Constraints = {
			enum: ['Microsoft', 'Apple', 'Google'],
		}

		element2.constraints = nameConstraints

		const validationResult: ValidationResult = validateTable(
			parsed,
			codebookResult,
		)

		it('should return a validation result object', () => {
			expect(validationResult.columnErrors).toHaveLength(2)
			expect(validationResult.columnErrors[0].columnName).toBe('ID')
			expect(validationResult.columnErrors[0].rule).toBe('minimum')
			expect(validationResult.columnErrors[1].columnName).toBe('Name')
			expect(validationResult.columnErrors[1].rule).toBe('enum')
		})
	})
})
