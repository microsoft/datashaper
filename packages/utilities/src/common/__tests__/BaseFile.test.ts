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
})

describe('BaseFile.name', () => {
	it('should get the name of the file', async () => {
		expect(jsonFile.name).toBe('file.json')
		expect(csvFile.name).toBe('file.csv')
	})
})

describe('BaseFile.isJson', () => {
	it('should return true', async () => {
		expect(jsonFile.isJson()).toBeTruthy()
	})
	it('should return false', async () => {
		expect(csvFile.isJson()).toBeFalsy()
	})
})

describe('BaseFile.isDsv', () => {
	it('should return true', async () => {
		expect(csvFile.isDsv()).toBeTruthy()
	})
	it('should return false', async () => {
		expect(jsonFile.isDsv()).toBeFalsy()
	})
})

describe('BaseFile.isTable', () => {
	it('should return true', async () => {
		expect(csvFile.isTable()).toBeTruthy()
	})
	it('should return false', async () => {
		expect(jsonFile.isTable()).toBeFalsy()
	})
})

describe('BaseFile.isSupported', () => {
	it('should return true', async () => {
		expect(csvFile.isSupported()).toBeTruthy()
		expect(jsonFile.isSupported()).toBeTruthy()
	})
	it('should return false', async () => {
		xlsxFile = new BaseFile(xlsx)
		expect(xlsxFile.isSupported()).toBeFalsy()
	})
})

describe('BaseFile.isReadable', () => {
	it('should return true', async () => {
		expect(csvFile.isReadable()).toBeTruthy()
		expect(jsonFile.isReadable()).toBeTruthy()
	})
	it('should return false', async () => {
		expect(xlsxFile.isReadable()).toBeFalsy()
	})
})

describe('BaseFile.toJson', () => {
	it('should return a json', async () => {
		await expect(jsonFile.toJson()).resolves.toEqual({ key: 'value' })
	})
	it('should throw an error', async () => {
		await expect(csvFile.toJson()).rejects.toThrow(
			'The provided file is not a json file',
		)
	})
})

describe('BaseFile.toText', () => {
	it('should return a json string', async () => {
		await expect(jsonFile.toText()).resolves.toContain('{"key": "value"}')
	})
	it('should return a csv string', async () => {
		await expect(csvFile.toText()).resolves.toContain('col1,col2\nval1,val2')
	})
})

describe('BaseFile.toDsvString', () => {
	it('should return a csv string', async () => {
		await expect(csvFile.toDsvString()).resolves.toBe('col1,col2\nval1,val2')
	})
	it('should throw an error', async () => {
		await expect(jsonFile.toDsvString()).rejects.toThrow(
			'The provided file is not a dsv file',
		)
	})
})

describe('BaseFile.toTable', () => {
	it('should return a table of 2 columns', async () => {
		const result = await csvFile.toTable()
		expect(result.numCols()).toBe(2)
	})
	it('should throw an error', async () => {
		await expect(jsonFile.toTable()).rejects.toThrow(
			'The provided file is not a dsv file',
		)
	})
})

describe('BaseFile.toDataURL', () => {
	it('should return a data url', async () => {
		await expect(csvFile.toDataURL()).resolves.toContain('data:')
	})
})

describe('BaseFile.rename', () => {
	it('should rename the file', async () => {
		const name = 'newName.xlsx'
		xlsxFile = new BaseFile(xlsx)
		expect(xlsxFile.name).toBe('file.xlsx')
		xlsxFile.rename(name)
		expect(xlsxFile.name).toBe(name)
	})
})
