/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { onehotStep } from '../onehot.js'

describe('test for onehot verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})

	test('no prefix', async () => {
		const result = await onehotStep(store.table('table5'), { column: 'item' })
		// added three new columns for the unique values, ignoring null
		expect(result.numCols()).toBe(6)
		expect(result.numRows()).toBe(6)

		expect(result.columnNames()).toEqual([
			'ID',
			'item',
			'quantity',
			'bed',
			'sofa',
			'chair',
		])

		// spot-check the binary one-hot values
		expect(result.get('bed', 0)).toBe(1)
		expect(result.get('bed', 1)).toBeNull()
		expect(result.get('bed', 2)).toBe(0)
		expect(result.get('sofa', 0)).toBe(0)
		expect(result.get('sofa', 1)).toBeNull()
		expect(result.get('sofa', 2)).toBe(1)
		expect(result.get('chair', 0)).toBe(0)
		expect(result.get('chair', 1)).toBeNull()
		expect(result.get('chair', 2)).toBe(0)
	})

	test('with prefix', async () => {
		const result = await onehotStep(store.table('table5'), {
			column: 'item',
			prefix: 'furniture_',
		})
		// added three new columns for the unique values, ignoring null
		expect(result.numCols()).toBe(6)
		expect(result.numRows()).toBe(6)

		expect(result.columnNames()).toEqual([
			'ID',
			'item',
			'quantity',
			'furniture_bed',
			'furniture_sofa',
			'furniture_chair',
		])

		// spot-check the binary one-hot values
		expect(result.get('furniture_bed', 0)).toBe(1)
		expect(result.get('furniture_sofa', 0)).toBe(0)
		expect(result.get('furniture_chair', 0)).toBe(0)
	})

	test('numeric', async () => {
		const result = await onehotStep(store.table('table5'), { column: 'ID' })
		// added three new columns for the unique values, ignoring null
		expect(result.numCols()).toBe(6)
		expect(result.numRows()).toBe(6)

		expect(result.columnNames()).toEqual([
			'ID',
			'item',
			'quantity',
			'1',
			'2',
			'4',
		])

		// spot-check the binary one-hot values
		expect(result.get('1', 0)).toBe(1)
		expect(result.get('2', 0)).toBe(0)
		expect(result.get('4', 0)).toBe(0)
	})
})
