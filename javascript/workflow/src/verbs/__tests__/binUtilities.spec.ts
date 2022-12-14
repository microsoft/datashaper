/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	calculateWidthAuto,
	calculateWidthDoane,
	calculateWidthFd,
	calculateWidthRice,
	calculateWidthScott,
	calculateWidthSqrt,
	calculateWidthSturges,
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

		const result = calculateWidthFd(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(73.68062997280774)
		})
	})

	describe('sturges algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateWidthSturges(10, 200, arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(35.70134669473044)
		})
	})

	describe('rice algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateWidthRice(10, 200, arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(34.99829923708368)
		})
	})

	describe('scott algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateWidthScott(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(69.16054564802737)
		})
	})

	describe('doane algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateWidthDoane(10, 200, arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(35.70134669473044)
		})
	})

	describe('sqrt algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateWidthSqrt(10, 200, arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(42.485291572496)
		})
	})

	describe('auto algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = calculateWidthAuto(10, 200, arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(73.68062997280774)
		})
	})
})
