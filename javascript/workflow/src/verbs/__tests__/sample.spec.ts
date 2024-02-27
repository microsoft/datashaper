/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table.js'
import { TestStore } from '../../__tests__/TestStore.js'
import { sampleStep } from '../sample.js'

describe('test for sample verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('sample test with percentage', () => {
		const result = sampleStep(
			store.table('table6'),
			{
				proportion: 0.4,
			},
			{ emit: () => null } as any,
		)

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(2)
	})

	test('sample test with size', () => {
		const result = sampleStep(
			store.table('table6'),
			{
				size: 4,
			},
			{ emit: () => null } as any,
		)

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(4)
	})

	test('sample test with size and preserve remainder', () => {
		let remainder: ColumnTable | undefined = undefined
		const result = sampleStep(
			store.table('table6'),
			{
				size: 4,
				emitRemainder: true,
				seed: 0xdeadbeef,
			},
			{
				emit: (table: ColumnTable) => {
					remainder = table
				},
			} as any,
		)

		expect(result.numRows()).toBe(4)
		expect(result.numCols()).toBe(3)
		expect(remainder).not.toBeNull()

		// 6 total rows, 4 sampled, so 2 should be leftover
		// rome-ignore: lint/style/noNonNullAssertion
		expect(remainder?.numRows()).toBe(2)
		// rome-ignore: lint/style/noNonNullAssertion
		expect(remainder?.numCols()).toBe(3)
	})
})
