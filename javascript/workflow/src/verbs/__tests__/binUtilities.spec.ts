/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	calculateNiceRounding,
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

describe('binUtilities', () => {
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
			expect(result).toBe(35.70134669473044)
		})
	})

	describe('huge numbers nice rounding test 1', () => {
		const result = calculateNiceRounding(12000000, 78500000, 12389720.271622058)
		const [min, max, width] = result

		it('algorithm result', () => {
			expect(min).toBe(10000000)
			expect(max).toBe(80000000)
			expect(width).toBe(20000000)
		})
	})

	describe('huge numbers nice rounding test 2', () => {
		const result = calculateNiceRounding(12000000, 78500000, 12671668.926380431)
		const [min, max, width] = result

		it('algorithm result', () => {
			expect(min).toBe(10000000)
			expect(max).toBe(80000000)
			expect(width).toBe(20000000)
		})
	})

	describe('huge numbers nice rounding test 3', () => {
		const result = calculateNiceRounding(12000000, 78500000, 12460642.878078489)
		const [min, max, width] = result

		it('algorithm result', () => {
			expect(min).toBe(10000000)
			expect(max).toBe(80000000)
			expect(width).toBe(20000000)
		})
	})

	describe('regular numbers nice rounding test 1', () => {
		const result = calculateNiceRounding(18, 67, 15.739759424941251)
		const [min, max, width] = result

		it('algorithm result', () => {
			expect(min).toBe(10)
			expect(max).toBe(70)
			expect(width).toBe(20)
		})
	})

	describe('regular numbers nice rounding test 2', () => {
		const result = calculateNiceRounding(18, 67, 11.241370959657525)
		const [min, max, width] = result

		it('algorithm result', () => {
			expect(min).toBe(10)
			expect(max).toBe(70)
			expect(width).toBe(20)
		})
	})

	describe('regular numbers nice rounding test 3', () => {
		const result = calculateNiceRounding(18, 67, 9.181526331215728)
		const [min, max, width] = result

		it('algorithm result', () => {
			expect(min).toBe(10)
			expect(max).toBe(70)
			expect(width).toBe(10)
		})
	})

	describe('small numbers nice rounding test 1', () => {
		const result = calculateNiceRounding(0.1457, 0.9988, 0.43906433672050404)
		const [min, max, width] = result

		it('algorithm result', () => {
			expect(min).toBe(0.1)
			expect(max).toBe(1)
			expect(width).toBe(0.44)
		})
	})

	describe('small numbers nice rounding test 2', () => {
		const result = calculateNiceRounding(0.1457, 0.9988, 0.1957145625649762)
		const [min, max, width] = result

		it('algorithm result', () => {
			expect(min).toBe(0.1)
			expect(max).toBe(1)
			expect(width).toBe(0.196)
		})
	})

	describe('small numbers nice rounding test 3', () => {
		const result = calculateNiceRounding(0.1457, 0.9988, 0.15985224720734975)
		const [min, max, width] = result

		it('algorithm result', () => {
			expect(min).toBe(0.1)
			expect(max).toBe(1)
			expect(width).toBe(0.16)
		})
	})

	describe('small numbers nice rounding test 4', () => {
		const result = calculateNiceRounding(
			0.00000123,
			0.9988,
			0.15985224720734975,
		)
		const [min, max, width] = result

		it('algorithm result', () => {
			expect(min).toBe(0)
			expect(max).toBe(1)
			expect(width).toBe(0.16)
		})
	})
})
