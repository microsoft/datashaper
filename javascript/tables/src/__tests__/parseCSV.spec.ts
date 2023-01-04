/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataType } from '@datashaper/schema'
import fs from 'fs'

import { parseCSV } from '../parseCSV'

describe('parseCSV', () => {
	it('should parse the csv', () => {
		const codebook = {
			$schema: '??',
			name: 'TEST',
			fields: [
				{
					name: 'index',
					type: DataType.Number,
				},
				{
					name: 'int',
					type: DataType.Number,
				},
				{
					name: 'float',
					type: DataType.Number,
				},
				{
					name: 'string',
					type: DataType.String,
				},
				{
					name: 'boolean',
					type: DataType.Boolean,
				},
				{
					name: 'array',
					type: DataType.Array,
				},
				{
					name: 'date',
					type: DataType.Date,
				},
				{
					name: 'obj',
					type: DataType.Object,
				},
			],
		}

		const csv = fs.readFileSync('./src/__tests__/data/simple-example.csv', {
			encoding: 'utf8',
			flag: 'r',
		})

		const parsed = parseCSV(csv, { codebook })

		expect(parsed.column('int')?.get(0)).toBe(100)
		expect(parsed.column('float')?.get(0)).toBe(1.01)
		expect(parsed.column('boolean')?.get(0)).toBe(true)
		expect(parsed.column('string')?.get(0)).toBe('aaa')
		expect(parsed.column('date')?.get(0)).toBe('2022-08-15')
		expect(parsed.column('array')?.get(0)).toEqual([1, 2, 3])
		expect(parsed.column('obj')?.get(0)).toEqual({
			a: 123,
			b: 'BBBB',
			c: false,
			d: null,
			e: undefined,
		})
	})
})
