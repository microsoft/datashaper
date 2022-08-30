/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadTable } from '../loadTable.js'

const text = `first,second,third
1,100,one
3,200,two
3,300,three
#4,400,four
5,500,five`

const delimiter = `1:100:one
2:200:two
3:300:three
4:400:four
5:500:five`

describe('load CSV', () => {
	it('load default data without params', () => {
		const table = loadTable(text)
		expect(table.numRows()).toBe(5)
		expect(table.numCols()).toBe(3)
	})

	it('load table with custom delimiter and names list', () => {
		const table = loadTable(delimiter, {
			header: false,
			names: ['first', 'second', 'third'],
			delimiter: ':',
		})
		expect(table.numRows()).toBe(5)
	})

	it('load table with custom delimiter expecting it to guess it', () => {
		const table = loadTable(delimiter)
		expect(table.numRows()).toBe(4)
	})

	it('load table skipping commented line 4 with # as comment char', () => {
		const table = loadTable(text, {
			comment: '#',
		})
		expect(table.column('first')?.get(3)).toBe(5)
	})

	it.skip('load table receiving error with comment option with more than 1 character', () => {
		const options = {
			comment: '#@',
		}
		expect(loadTable(text, options)).toThrow(
			'Comment option should be a single character',
		)
	})
})
