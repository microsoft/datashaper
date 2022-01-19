/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { BaseFile } from '..'
import { createFileWithPath } from '../../utils'

let jsonFile
let csvFile
let xlsxFile
const jsonBlob = new Blob(['{"key": "value"}'])
const csvBlob = new Blob(['col1,col2\nval1,val2'])
const json = createFileWithPath(jsonBlob, {
	type: 'application/json',
	name: 'file.json',
})
const csv = createFileWithPath(csvBlob, { type: 'text/csv', name: 'file.csv' })
const xlsx = createFileWithPath(csvBlob, {
	type: 'application/vnd.ms-excel',
	name: 'file.xlsx',
})
beforeEach(() => {
	jsonFile = new BaseFile(json)
	csvFile = new BaseFile(csv)
	xlsxFile = new BaseFile(xlsx)
})

describe('Get file name', () => {
	it('BaseFile name', async () => {
		expect(jsonFile.name).toBe('file.json')
		expect(csvFile.name).toBe('file.csv')
	})
})

describe('Validate is file is .json', () => {
	it('BaseFile isJson', async () => {
		expect(jsonFile.isJson()).toBeTruthy()
		expect(csvFile.isJson()).toBeFalsy()
	})
})

describe('Validate is file is dsv', () => {
	it('BaseFile isDsv', async () => {
		expect(jsonFile.isDsv()).toBeFalsy()
		expect(csvFile.isDsv()).toBeTruthy()
	})
})

describe('Validate is file is table', () => {
	it('BaseFile isTable', async () => {
		expect(jsonFile.isTable()).toBeFalsy()
		expect(csvFile.isTable()).toBeTruthy()
	})
})

describe('Validate is file is supported', () => {
	it('BaseFile isSupported', async () => {
		expect(xlsxFile.isSupported()).toBeFalsy()
		expect(jsonFile.isSupported()).toBeTruthy()
		expect(csvFile.isSupported()).toBeTruthy()
	})
})

describe('Validate is file is readable', () => {
	it('BaseFile isReadable', async () => {
		expect(xlsxFile.isReadable()).toBeFalsy()
		expect(jsonFile.isReadable()).toBeTruthy()
		expect(csvFile.isReadable()).toBeTruthy()
	})
})

describe('Get json from file', () => {
	it('BaseFile toJson', async () => {
		/* eslint-disable @essex/adjacent-await */
		await expect(jsonFile.toJson()).resolves.toEqual({ key: 'value' })
		await expect(csvFile.toJson()).rejects.toThrow(
			'The provided file is not a json file',
		)
	})
})

describe('Get file text', () => {
	it('BaseFile toText', async () => {
		/* eslint-disable @essex/adjacent-await */
		await expect(jsonFile.toText()).resolves.toContain('{"key": "value"}')
		await expect(csvFile.toText()).resolves.toContain('col1,col2\nval1,val2')
	})
})

describe('Get file dsv string', () => {
	it('BaseFile toDsvString', async () => {
		/* eslint-disable @essex/adjacent-await */
		await expect(csvFile.toDsvString()).resolves.toBe('col1,col2\nval1,val2')
		await expect(jsonFile.toDsvString()).rejects.toThrow(
			'The provided file is not a dsv file',
		)
	})
})

describe('Get arquero table from file', () => {
	it('BaseFile toTable', async () => {
		const result = await csvFile.toTable()
		expect(result.numCols()).toBe(2)
		await expect(jsonFile.toTable()).rejects.toThrow(
			'The provided file is not a dsv file',
		)
	})
})

describe('Get file data url', () => {
	it('BaseFile toDataURL', async () => {
		await expect(csvFile.toDataURL()).resolves.toContain('data:')
	})
})

describe('Rename file', () => {
	it('BaseFile rename', async () => {
		const name = 'newName.xlsx'
		expect(xlsxFile.name).toBe('file.xlsx')
		xlsxFile.rename(name)
		expect(xlsxFile.name).toBe(name)
	})
})
