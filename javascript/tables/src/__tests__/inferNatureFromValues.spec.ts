/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { VariableNature } from '@datashaper/schema'

import { inferNatureFromValues } from '../inferNatureFromValues.js'

describe('inferNatureFromValues', () => {
	describe('binary', () => {
		test('all booleans', () => {
			const values: boolean[] = [true, false, false, true]
			const nature: VariableNature = inferNatureFromValues(values)
			expect(nature).toBe(VariableNature.Binary)
		})

		test('ones and zeros', () => {
			const values: (number | null)[] = [1, 1, 1, 0, 1, 0, 0, 0, null, null]
			const nature: VariableNature = inferNatureFromValues(values)
			expect(nature).toBe(VariableNature.Binary)
		})

		test('strings', () => {
			const values: (string | null)[] = [
				'Y',
				'N',
				null,
				'Y',
				'Y',
				'N',
				'N',
				'N',
			]
			const nature: VariableNature = inferNatureFromValues(values)
			expect(nature).toBe(VariableNature.Binary)
		})
	})

	describe('discrete', () => {
		test('whole numbers', () => {
			const values: (number | null | undefined)[] = [
				12,
				67,
				89,
				90,
				null,
				23,
				undefined,
				10,
			]
			const nature: VariableNature = inferNatureFromValues(values)
			expect(nature).toBe(VariableNature.Discrete)
		})
	})

	describe('continuous', () => {
		test('decimal numbers', () => {
			const values: (number | null)[] = [
				1.2,
				55.3,
				78.99,
				null,
				99.6,
				-45.23,
				-98.23,
			]
			const nature: VariableNature = inferNatureFromValues(values)
			expect(nature).toBe(VariableNature.Continuous)
		})

		test('lots of unique strings', () => {
			const values: string[] = 'ABCDEFGHIJKLMPQRSTUVWXYZ'.split('')
			const nature: VariableNature = inferNatureFromValues(values)
			expect(nature).toBe(VariableNature.Continuous)
		})
	})

	describe('nominal', () => {
		test('categorical strings', () => {
			const values: (string | null | undefined)[] = [
				'category1',
				'category2',
				null,
				'category3',
				undefined,
				'category4',
			]
			const nature: VariableNature = inferNatureFromValues(values)
			expect(nature).toBe(VariableNature.Nominal)
		})
	})

	describe('ordinal', () => {
		test('sorted numbers', () => {
			const values: (number | null)[] = [1, null, null, 2, 3, 4, 5, 6]
			const nature: VariableNature = inferNatureFromValues(values)
			expect(nature).toBe(VariableNature.Ordinal)
		})

		test('unsorted numbers', () => {
			const values: (number | null)[] = [2, 4, 3, 1, 5]
			const nature: VariableNature = inferNatureFromValues(values)
			expect(nature).toBe(VariableNature.Ordinal)
		})
	})

	describe('non-default options', () => {
		test('binary ignores higher numbers due to limit', () => {
			const values: number[] = [1, 1, 1, 0, 1, 0, 0, 0, 3, 4, 5]
			const nature: VariableNature = inferNatureFromValues(values, {
				limit: 5,
			})
			expect(nature).toBe(VariableNature.Binary)
		})
		test('binary ignores specified null value', () => {
			const values: number[] = [1, 1, 1, 0, 1, 2, 0, 0, 2]
			const nature: VariableNature = inferNatureFromValues(values, {
				nullValue: 2,
			})
			expect(nature).toBe(VariableNature.Binary)
		})
		test('categorical captures more allowed values', () => {
			const values: string[] = 'ABCDEFGHIJKLMPQRSTUVWXYZ'.split('')
			const nature: VariableNature = inferNatureFromValues(values, {
				categoricalCountLimit: 30,
			})
			expect(nature).toBe(VariableNature.Nominal)
		})
	})
})
