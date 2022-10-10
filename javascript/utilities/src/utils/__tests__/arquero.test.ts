/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import Blob from 'cross-blob'

import { BaseFile, FileWithPath } from '../../common/index.js'
import { loadTable, tableToHTML } from '../arquero.js'

describe('returns an Arquero table', () => {
	it('loadTable', async () => {
		const blob = new Blob(['col1,col2\nA1,A2'])
		const file = new BaseFile(new FileWithPath(blob, 'file.csv', './index.js'))
		const result = await loadTable(file)
		const expected = 2
		expect(result.numCols()).toBe(expected)
	})
})

describe('returns an HTML table', () => {
	it('tableToHTML', async () => {
		const blob = new Blob(['col1,col2\nA1,A2'])
		const file = new BaseFile(new FileWithPath(blob, 'file.csv', './index.js'))
		const result = await tableToHTML(file)
		expect(result).toContain('<table>')
	})
})
