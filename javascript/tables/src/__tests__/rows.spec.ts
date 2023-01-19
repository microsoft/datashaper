/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'

import { rows } from '../rows.js'

describe('row utilities', () => {
	describe('rows', () => {
		const tbl = table({
			id: [1, 2, 3],
			name: ['a', 'b'],
		})

		test('defaults', () => {
			const output = rows(tbl)
			expect(output).toEqual([
				['id', 'name'],
				[1, 'a'],
				[2, 'b'],
				[3, undefined],
			])
		})

		test('skipHeader', () => {
			const output = rows(tbl, { skipHeader: true })
			expect(output).toEqual([
				[1, 'a'],
				[2, 'b'],
				[3, undefined],
			])
		})

		test('stringify', () => {
			const output = rows(tbl, { stringify: true })
			expect(output).toEqual([
				['id', 'name'],
				['1', 'a'],
				['2', 'b'],
				['3', ''],
			])
		})

		test('format', () => {
			const output = rows(tbl, {
				format: {
					id: (d) => d * 2,
				},
			})
			expect(output).toEqual([
				['id', 'name'],
				[2, 'a'],
				[4, 'b'],
				[6, undefined],
			])
		})
	})
})
