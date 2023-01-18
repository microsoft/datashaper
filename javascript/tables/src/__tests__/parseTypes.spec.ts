/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { typeGuesserFactory } from '../guessDataType.js'
import {
	parseArray,
	parseBoolean,
	parseDate,
	parseNumber,
	parseObject,
	parseString,
} from '../parseTypes.js'
process.env.TZ = 'America/Los_Angeles'

describe('parser tests', () => {
	describe('validate if value is null', () => {
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

	describe('parse number', () => {
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

	describe('parse boolean', () => {
		it('should parse a true', () => {
			expect(parseBoolean()('TRUE')).toBe(true)
		})
		it('should parse a false', () => {
			expect(parseBoolean()('FALSE')).toBe(false)
		})
		it('should parse a custom true', () => {
			expect(parseBoolean(undefined, ['Hola'])('hola')).toBe(true)
		})
		it('should parse a custom false', () => {
			expect(parseBoolean(undefined, undefined, ['Ciao'])('ciao')).toBe(false)
		})
		it('should return null', () => {
			expect(parseBoolean()('NA')).toBeNull()
		})
	})

	describe('parse string', () => {
		it('should parse a string', () => {
			const str = 'MS Research'
			expect(parseString()(str)).toBe(str)
		})
		it('should return null', () => {
			expect(parseString()('-1.#IND')).toBeNull()
		})
	})

	describe('parse date', () => {
		it('should parse a date', () => {
			const actual = parseDate()('2022-05-30T04:20:00')
			expect(actual?.toUTCString()).toBe('Mon, 30 May 2022 11:20:00 GMT')
		})
		it('should parse a numeric date', () => {
			const actual = parseDate()('1659737701263')
			expect(actual?.toUTCString()).toBe('Fri, 05 Aug 2022 22:15:01 GMT')
		})
		it('should return null', () => {
			expect(parseDate()('<NA>')).toBeNull()
		})
	})

	describe('parse array', () => {
		it('should parse an array', () => {
			const arr = '1,2,3'
			expect(parseArray()(arr)).toEqual([1, 2, 3])
		})
		it('should return null', () => {
			expect(parseArray()('n/a')).toBeNull()
		})
	})

	describe('parse Object', () => {
		it('should parse an Object', () => {
			const obj = '{"a":1,"b":2}'
			expect(parseObject()(obj)).toEqual({ a: 1, b: 2 })
		})
		it('should return null', () => {
			expect(parseObject()('n/a')).toBeNull()
		})
	})
})
