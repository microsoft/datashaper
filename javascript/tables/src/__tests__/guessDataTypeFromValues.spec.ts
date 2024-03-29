/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataFormat, DataType } from '@datashaper/schema'

import { guessDataTypeFromValues } from '../guessDataTypeFromValues.js'

describe('guessDataTypeFromValues', () => {
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
		it('should return array', () => {
			// TODO: CSV text cells should be quoted
			const columnType = guessDataTypeFromValues(['<NA>', 'a,b', 'd', 'f,g'])
			expect(columnType).toBe(DataType.Array)
		})

		it('should detect typed arrays', () => {
			const columnType = guessDataTypeFromValues([
				new Float64Array([1.1, 2.1, 3.1]),
				new Float64Array([4.3, 5.2, 6.4]),
			])
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
		const values = ['1', '1.23568', 'null', 'test', '<NA>', 'n/a', 'TRUE']

		it('mixed types defaults to string', () => {
			const columnType = guessDataTypeFromValues(values)
			expect(columnType).toBe(DataType.String)
		})

		it('limit misses mixed types', () => {
			const columnType = guessDataTypeFromValues(values, DataFormat.CSV, 3)
			expect(columnType).toBe(DataType.Number)
		})
	})
})
