/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OneHotStep } from '../../types.js'
import { Verb } from '../../types.js'
import { onehot } from '../verbs/onehot.js'
import { TestStore } from './TestStore.js'

describe('test for onehot verb', () => {
	test('no prefix', () => {
		const step: OneHotStep = {
			verb: Verb.OneHot,
			input: 'table5',
			output: 'output',
			args: { column: 'item' },
		}

		const store = new TestStore()

		return onehot(step, store).then(result => {
			// added three new columns for the unique values, ignoring null
			expect(result.table!.numCols()).toBe(6)
			expect(result.table!.numRows()).toBe(6)

			expect(result.table!.columnNames()).toEqual([
				'ID',
				'item',
				'quantity',
				'bed',
				'sofa',
				'chair',
			])

			// spot-check the binary one-hot values
			expect(result.table!.get('bed', 0)).toBe(1)
			expect(result.table!.get('bed', 1)).toBeNull()
			expect(result.table!.get('bed', 2)).toBe(0)
			expect(result.table!.get('sofa', 0)).toBe(0)
			expect(result.table!.get('sofa', 1)).toBeNull()
			expect(result.table!.get('sofa', 2)).toBe(1)
			expect(result.table!.get('chair', 0)).toBe(0)
			expect(result.table!.get('chair', 1)).toBeNull()
			expect(result.table!.get('chair', 2)).toBe(0)
		})
	})

	test('with prefix', () => {
		const step: OneHotStep = {
			verb: Verb.OneHot,
			input: 'table5',
			output: 'output',
			args: { column: 'item', prefix: 'furniture_' },
		}

		const store = new TestStore()

		return onehot(step, store).then(result => {
			// added three new columns for the unique values, ignoring null
			expect(result.table!.numCols()).toBe(6)
			expect(result.table!.numRows()).toBe(6)

			expect(result.table!.columnNames()).toEqual([
				'ID',
				'item',
				'quantity',
				'furniture_bed',
				'furniture_sofa',
				'furniture_chair',
			])

			// spot-check the binary one-hot values
			expect(result.table!.get('furniture_bed', 0)).toBe(1)
			expect(result.table!.get('furniture_sofa', 0)).toBe(0)
			expect(result.table!.get('furniture_chair', 0)).toBe(0)
		})
	})

	test('numeric', () => {
		const step: OneHotStep = {
			verb: Verb.OneHot,
			input: 'table5',
			output: 'output',
			args: { column: 'ID' },
		}

		const store = new TestStore()

		return onehot(step, store).then(result => {
			// added three new columns for the unique values, ignoring null
			expect(result.table!.numCols()).toBe(6)
			expect(result.table!.numRows()).toBe(6)

			expect(result.table!.columnNames()).toEqual([
				'ID',
				'item',
				'quantity',
				'1',
				'2',
				'4',
			])

			// spot-check the binary one-hot values
			expect(result.table!.get('1', 0)).toBe(1)
			expect(result.table!.get('2', 0)).toBe(0)
			expect(result.table!.get('4', 0)).toBe(0)
		})
	})
})
