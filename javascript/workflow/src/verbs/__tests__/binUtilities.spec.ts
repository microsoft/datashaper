/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	autoStrategy,
	doaneStrategy,
	fdStrategy,
	iqr,
	riceStrategy,
	scottStrategy,
	sqrtStrategy,
	standardDeviation,
	sturgesStrategy,
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

		const result = fdStrategy(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(73.68062997280774)
		})
	})

	describe('sturges algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = sturgesStrategy(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(5.321928094887363)
		})
	})

	describe('rice algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = riceStrategy(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(5.428835233189813)
		})
	})

	describe('scott algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = scottStrategy(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(76.08298919235817)
		})
	})

	describe('doane algorithm test', () => {
		const arrayValues = [
			62.55976, -14.71019, -20.67025, -35.43758, -10.65457, 21.55292, 41.26359,
			0.33537, -14.43599, -40.66612, 6.45701, -40.39694, 55.1221, 24.50901,
			6.61822, -29.10305, 6.21494, 15.25862, 13.54446, 2.48212, -2.34573,
			-21.47846, -5.0777, 26.48881, -8.68764, -5.49631, 42.58039, -6.59111,
			-23.08169, 19.09755, -21.35046, 0.24064, -3.16365, -37.43091, 24.48556,
			2.6263, 31.14471, 5.75287, -46.8529, -14.26814, 8.41045, 18.11071,
			-30.46438, 12.22195, -31.83203, -8.09629, 52.06456, -24.30986, -25.62359,
			2.86882, 15.77073, 31.17838, -22.04998,
		]

		const result = doaneStrategy(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(8.778812503435516)
		})
	})

	describe('sqrt algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = sqrtStrategy(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(4.47213595499958)
		})
	})

	describe('auto algorithm test', () => {
		const arrayValues = [
			10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
			170, 180, 190, 200,
		]

		const result = autoStrategy(arrayValues)

		it('algorithm result', () => {
			expect(result).toBe(73.68062997280774)
		})
	})
})
