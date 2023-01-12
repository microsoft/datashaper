/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { typeGuesserFactory } from '../guessDataType.js'

describe('Validators tests', () => {
	describe('isBoolean', () => {
		let { isBoolean } = typeGuesserFactory()
		it('should return true', () => {
			expect(isBoolean('true')).toBe(true)
			expect(isBoolean('FALSE')).toBe(true)
			isBoolean = typeGuesserFactory({ trueValues: ['yes'] }).isBoolean
			expect(isBoolean('Yes')).toBe(true)
			isBoolean = typeGuesserFactory({ trueValues: ['T'] }).isBoolean
			expect(isBoolean('t')).toBe(true)
			isBoolean = typeGuesserFactory({ trueValues: ['Y'] }).isBoolean
			expect(isBoolean('y')).toBe(true)
			isBoolean = typeGuesserFactory({ trueValues: ['1'] }).isBoolean
			expect(isBoolean('1')).toBe(true)
			isBoolean = typeGuesserFactory({ falseValues: ['NO'] }).isBoolean
			expect(isBoolean('no')).toBe(true)
			isBoolean = typeGuesserFactory({ falseValues: ['F'] }).isBoolean
			expect(isBoolean('f')).toBe(true)
			isBoolean = typeGuesserFactory({ falseValues: ['n'] }).isBoolean
			expect(isBoolean('N')).toBe(true)
			isBoolean = typeGuesserFactory({ falseValues: ['0'] }).isBoolean
			expect(isBoolean('0')).toBe(true)
		})
		it('should return false', () => {
			expect(isBoolean('{"a": 1, "b": 2}')).toBe(false)
			expect(isBoolean('["a", "b", "c"]')).toBe(false)
			expect(isBoolean('2022-02-14')).toBe(false)
			expect(isBoolean('NaN')).toBe(false)
			expect(isBoolean('null')).toBe(false)
			expect(isBoolean('aaa')).toBe(false)
			expect(isBoolean('-1.1')).toBe(false)
		})
	})

	describe('isNumber', () => {
		let { isNumber } = typeGuesserFactory()
		it('should return true', () => {
			expect(isNumber('1.00003')).toBe(true)
			expect(isNumber('5000')).toBe(true)
			expect(isNumber('-98575')).toBe(true)
			expect(isNumber('-0.333648')).toBe(true)
			const isNumber1 = typeGuesserFactory({ thousands: ',' }).isNumber
			expect(isNumber1('1,550,878.05')).toBe(true)
			const isNumber2 = typeGuesserFactory({
				decimal: ',',
				thousands: '.',
			}).isNumber
			expect(isNumber2('1.550.878,05')).toBe(true)
		})
		it('should return false', () => {
			// thousands were not specified, so this should be false
			expect(isNumber('1,550,878.05')).toBe(false)
			expect(isNumber('{"a": 1, "b": 2}')).toBe(false)
			expect(isNumber('["a", "b", "c"]')).toBe(false)
			expect(isNumber('2022-02-14')).toBe(false)
			expect(isNumber('NaN')).toBe(false)
			expect(isNumber('null')).toBe(false)
			expect(isNumber('aaa')).toBe(false)
			expect(isNumber('false')).toBe(false)
		})
	})

	describe('isArray', () => {
		const { isArray } = typeGuesserFactory()
		it('should return true', () => {
			expect(isArray('[1, 2, 3]')).toBe(true)
			expect(isArray('["a", "b", "c"]')).toBe(true)
			expect(isArray('[true, false, true]')).toBe(true)
			expect(isArray('["null", "NaN", 1]')).toBe(true)
		})
		it('should return false', () => {
			expect(isArray('{"a": 1, "b": 2}')).toBe(false)
			expect(isArray('2022-02-14')).toBe(false)
			expect(isArray('NaN')).toBe(false)
			expect(isArray('null')).toBe(false)
			expect(isArray('aaa')).toBe(false)
			expect(isArray('false')).toBe(false)
			expect(isArray('-1.1')).toBe(false)
		})
	})

	describe('isObject', () => {
		const { isObject } = typeGuesserFactory()
		it('should return true', () => {
			expect(isObject('{"a": 1, "b": 2}')).toBe(true)
			expect(isObject('{"a": "false", "b": "true"}')).toBe(true)
		})
		it('should return false', () => {
			expect(isObject('["a", "b", "c"]')).toBe(false)
			expect(isObject('2022-02-14')).toBe(false)
			expect(isObject('NaN')).toBe(false)
			expect(isObject('null')).toBe(false)
			expect(isObject('aaa')).toBe(false)
			expect(isObject('false')).toBe(false)
			expect(isObject('-1.1')).toBe(false)
		})
	})

	describe('isDate', () => {
		const { isDate } = typeGuesserFactory()
		it('should return true', () => {
			expect(isDate('2022-02-14')).toBe(true)
			expect(isDate('2022-02-14T00:23:12')).toBe(true)
			expect(isDate('1659737701263')).toBe(true)
			expect(
				isDate('Fri Aug 12 2022 17:14:07 GMT-0500 (Colombia Standard Time)'),
			).toBe(true)
			expect(isDate('3/25/2022')).toBe(true)
			expect(isDate('Fri Aug 09 2022')).toBe(true)
		})
		it('should return false', () => {
			expect(isDate('{"a": 1, "b": 2}')).toBe(false)
			expect(isDate('["a", "b", "c"]')).toBe(false)
			expect(isDate('NaN')).toBe(false)
			expect(isDate('null')).toBe(false)
			expect(isDate('aaa')).toBe(false)
			expect(isDate('false')).toBe(false)
		})
	})
})
