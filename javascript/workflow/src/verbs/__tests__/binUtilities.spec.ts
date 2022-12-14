/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	calculateAutoBinCount,
	calculateBinWidthFd,
	calculateBinWidthScott,
	calculateNumberOfBinsDoane,
	calculateNumberOfBinsRice,
	calculateNumberOfBinsSqrt,
	calculateNumberOfBinsSturges,
	iqr,
	standardDeviation,
} from '../util/binUtilities.js'

describe('bin utilities tests', () => {
	describe('standard deviation test', () => {
		const arrayValues = [12, 15, 17, 20, 30, 31, 43, 44, 54]
		const result = standardDeviation(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(14.825)
		})
	})

	describe('iqr test', () => {
		const arrayValues = [8, 2, 3, 9, 5, 1, 4, 10, 7, 0, 6]
		const result = iqr(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(6)
		})
	})

	describe('fd algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateBinWidthFd(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(73.68062997280774)
		})
	})

	describe('sturges algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateNumberOfBinsSturges(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(5.321928094887363)
		})
	})

	describe('rice algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateNumberOfBinsRice(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(5.428835233189813)
		})
	})

	describe('scott algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateBinWidthScott(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(76.08298919235817)
		})
	})

	describe('doane algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateNumberOfBinsDoane(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(6.961050453244353)
		})
	})

	describe('sqrt algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateNumberOfBinsSqrt(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(4.47213595499958)
		})
	})

	describe('auto algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateAutoBinCount(10, 200, arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(63.333333333333336)
		})
	})
})
