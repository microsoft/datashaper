/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/schema'
import { typeGuesserFactory } from '../guessDataType.js'
import {
	parseArray,
	parseBoolean,
	parseDate,
	parseNumber,
	parseObject,
	parseString,
} from '../parseTypes.js'

describe('Timezones', () => {
	// verify jest is stable across TZs
	it('should always be UTC', () => {
		expect(new Date().getTimezoneOffset()).toBe(0)
	})
})

describe('parseTypes', () => {
	describe('null values', () => {
		let { isNull } = typeGuesserFactory()
		it('should return false', () => {
			expect(isNull('No')).toBe(false)
		})
		it('should return true', () => {
			expect(isNull('')).toBe(true)
		})
		it('should parse a custom null', () => {
			isNull = typeGuesserFactory({ naValues: ['none_2'] }).isNull
			expect(isNull('none_2')).toBe(true)
		})
	})

	describe('numbers', () => {
		it('should parse an int', () => {
			expect(parseNumber()('1')).toBe(1)
		})
		it('should parse a float', () => {
			expect(parseNumber()('1.1')).toBe(1.1)
		})
		it('should parse an int with custom thousand divider', () => {
			expect(parseNumber(undefined, undefined, '/')('-12/345/678')).toBe(
				-12345678,
			)
		})
		it('should parse a float with custom decimal divider', () => {
			expect(parseNumber(undefined, ':')('1:1')).toBe(1.1)
		})
		it('should parse a number with custom decimal and thousand divider', () => {
			expect(parseNumber(undefined, ',', '.')('1.234,078')).toBe(1234.078)
		})
		it('should return null', () => {
			expect(parseNumber()('-nan')).toBeNull()
		})
	})

	describe('booleans', () => {
		it('should parse a true', () => {
			expect(parseBoolean()('TRUE')).toBe(true)
		})
		it('should parse a false', () => {
			expect(parseBoolean()('FALSE')).toBe(false)
		})
		it('should parse a custom true', () => {
			expect(parseBoolean(undefined, ['Hola'])('Hola')).toBe(true)
			expect(parseBoolean(undefined, ['Hola'])('hola')).toBeNull()
		})
		it('should parse a custom false', () => {
			expect(parseBoolean(undefined, undefined, ['Ciao'])('Ciao')).toBe(false)
			expect(parseBoolean(undefined, undefined, ['Ciao'])('ciao')).toBeNull()
		})
		it('should return null', () => {
			expect(parseBoolean()('NA')).toBeNull()
		})
	})

	describe('strings', () => {
		it('should parse a string', () => {
			const str = 'MS Research'
			expect(parseString()(str)).toBe(str)
		})
		it('should return null', () => {
			expect(parseString()('-1.#IND')).toBeNull()
		})
	})

	describe('dates', () => {
		it('should parse a date', () => {
			const actual = parseDate()('2022-05-30T04:20:00')
			expect(actual?.toUTCString()).toBe('Mon, 30 May 2022 04:20:00 GMT')
		})
		it('should parse a numeric date', () => {
			const actual = parseDate()('1659737701263')
			expect(actual?.toUTCString()).toBe('Fri, 05 Aug 2022 22:15:01 GMT')
		})
		it('should return null', () => {
			expect(parseDate()('<NA>')).toBeNull()
		})
	})

	describe('arrays', () => {
		it('should parse an array', () => {
			const arr = '1,2,3'
			expect(parseArray()(arr)).toEqual(['1', '2', '3'])
		})
		it('should parse an array with subtype', () => {
			const arr = '1,2,3'
			expect(parseArray(DataType.Integer)(arr)).toEqual([1, 2, 3])
		})
		it('should return null', () => {
			expect(parseArray()('n/a')).toBeNull()
		})
	})

	describe('objects', () => {
		it('should parse an Object', () => {
			const obj = '{"a":1,"b":2}'
			expect(parseObject()(obj)).toEqual({ a: 1, b: 2 })
		})
		it('should return null', () => {
			expect(parseObject()('n/a')).toBeNull()
		})
	})
})
