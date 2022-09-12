/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataType } from '@datashaper/schema'

import { guessDataTypeFromValues } from '../guessDataTypeFromValues.js'

describe('guess datatype by column tests', () => {
	describe('boolean', () => {
		const columnType = guessDataTypeFromValues([
			'true',
			'TRUE',
			'True',
			'FALSE',
			'fALSE',
		])

		it('should return boolean', () => {
			expect(columnType).toBe(DataType.Boolean)
		})
	})

	describe('number', () => {
		const columnType = guessDataTypeFromValues([
			'1',
			'2',
			'3',
			'4',
			null,
			'n/a',
		])

		it('should return number', () => {
			expect(columnType).toBe(DataType.Number)
		})
	})

	describe('array', () => {
		const columnType = guessDataTypeFromValues(['<NA>', '[]', '[]', '[]'])

		it('should return array', () => {
			expect(columnType).toBe(DataType.Array)
		})
	})

	describe('object', () => {
		const columnType = guessDataTypeFromValues([
			'<NA>',
			'{"test": "1"}',
			'NULL',
			'{}',
		])

		it('should return object', () => {
			expect(columnType).toBe(DataType.Object)
		})
	})

	describe('date', () => {
		const columnType = guessDataTypeFromValues([
			'<NA>',
			new Date().toISOString(),
			'3/25/2022',
			'Fri Aug 12 2022 17:14:07 GMT-0500 (Colombia Standard Time)',
		])

		it('should return true', () => {
			expect(columnType).toBe(DataType.Date)
		})
	})

	describe('string', () => {
		const columnType = guessDataTypeFromValues([
			'null',
			'test',
			'test2',
			'<NA>',
			'n/a',
			'test3',
		])

		it('should return string', () => {
			expect(columnType).toBe(DataType.String)
		})
	})

	describe('string (different types)', () => {
		const columnType = guessDataTypeFromValues([
			'null',
			'test',
			'1',
			'<NA>',
			'n/a',
			'1.23568',
			'TRUE',
		])

		it('should return string', () => {
			expect(columnType).toBe(DataType.String)
		})
	})
})
