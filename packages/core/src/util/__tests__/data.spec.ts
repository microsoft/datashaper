/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { formatIfNumber } from '..'
import { format } from '../data'

describe('data utilities', () => {
	describe('format', () => {
		it('should be formatted to 3e-6', () => {
			const value = 0.000003
			const formatted = format(value)
			const expected = '3e-6'
			expect(formatted).toEqual(expected)
		})
		it('should be formatted to 3e7', () => {
			const value = 30000000
			const formatted = format(value)
			const expected = '3e7'
			expect(formatted).toEqual(expected)
		})
		it('should not be formatted', () => {
			const value = 3000
			const formatted = format(value)
			expect(formatted).toBe(`${value}`)
		})
	})

	describe('formatIfNumber', () => {
		it('should be formatted to 3e-6', () => {
			const value = '0.000003'
			const formatted = formatIfNumber(value)
			const expected = '3e-6'
			expect(formatted).toEqual(expected)
		})
		it('should be formatted to 3e7', () => {
			const value = '30000000'
			const formatted = formatIfNumber(value)
			const expected = '3e7'
			expect(formatted).toEqual(expected)
		})
		it('should be formatted', () => {
			const value = '384230993.3000009'
			const formatted = formatIfNumber(value)
			const expected = '384230993.3'
			expect(formatted).toEqual(expected)
		})
		it('should not be formatted', () => {
			const value = 'this is not a number'
			const formatted = formatIfNumber(value)
			expect(formatted).toEqual(value)
		})
	})
})
