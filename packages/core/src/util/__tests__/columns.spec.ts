/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import { columnIndexesWithZeros, columnNamesWithZeros } from '../columns'

describe('column utilities', () => {
	const tbl = table({
		id: [1, 2, 3, 4, 5],
		// put some zeros in various positions to ensure we get edge cases
		value: [1, 1, 0, 1, 1],
		value2: [1, 1, 1, 1, 0],
		value3: [0, 1, 1, 1, 1],
	})

	test('columnIndexesWithZeroes', () => {
		expect(columnIndexesWithZeros(tbl)).toEqual([1, 2, 3])
	})

	test('columnNamesWithZeroes', () => {
		expect(columnNamesWithZeros(tbl)).toEqual(['value', 'value2', 'value3'])
	})
})
