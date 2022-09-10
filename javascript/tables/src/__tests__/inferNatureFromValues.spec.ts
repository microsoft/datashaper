/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { VariableNature } from '@datashaper/schema'

import { inferNatureFromValues } from '../inferNatureFromValues.js'

describe('Infer nature from values tests', () => {
	describe('binary', () => {
		const values: boolean[] = [true, false, false, true]
		const values2: number[] = [1, 1, 1, 0, 1, 0, 0, 0, null, null]

		const nature: VariableNature = inferNatureFromValues(values)
		const nature2: VariableNature = inferNatureFromValues(values2)

		it('should return true', () => {
			expect(nature).toBe(VariableNature.Binary)
			expect(nature2).toBe(VariableNature.Binary)
		})
	})

	describe('discrete', () => {
		const values: number[] = [12, 67, 89, 90, null, 23, undefined, 10]
		const values2: number[] = [
			12,
			61,
			89,
			90,
			null,
			23,
			undefined,
			10,
			56,
			67,
			100,
			45,
		]

		const nature: VariableNature = inferNatureFromValues(values)
		const nature2: VariableNature = inferNatureFromValues(values2, 11)
		const nature3: VariableNature = inferNatureFromValues(values2, 9)

		it('should return true', () => {
			expect(nature).toBe(VariableNature.Discrete)
			expect(nature2).toBe(VariableNature.Discrete)
			expect(nature3).toBe(VariableNature.Discrete)
		})
	})

	describe('continuous', () => {
		const values: number[] = [1.2, 55.3, 78.99, null, 99.6, -45.23, -98.23]
		const nature: VariableNature = inferNatureFromValues(values)

		it('should return true', () => {
			expect(nature).toBe(VariableNature.Continuous)
		})
	})

	describe('nominal', () => {
		const values: string[] = [
			'category1',
			'category2',
			null,
			'category3',
			undefined,
			'category4',
		]

		const nature: VariableNature = inferNatureFromValues(values)

		it('should return true', () => {
			expect(nature).toBe(VariableNature.Nominal)
		})
	})

	describe('ordinal', () => {
		const values: number[] = [1, null, null, 2, 3, 4, 5, 6]

		const nature: VariableNature = inferNatureFromValues(values)

		it('should return true', () => {
			expect(nature).toBe(VariableNature.Ordinal)
		})
	})
})
