/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BaseFile, FileWithPath } from '../../common/index.js'
import { guessFileType, isDsvFile, isJsonFile, isZipFile } from '..'
import {
	extension,
	getDataURL,
	getDsvFileContent,
	getJsonFileContentFromFile,
	getTextFromFile,
	guessDelimiter,
	isTableFile,
} from '../files.js'

describe('extension file functions', () => {
	it('returns txt as extension extension', () => {
		const name = 'file.txt'
		const expected = 'txt'
		const result = extension(name)
		expect(result).toEqual(expected)
	})

	it('throws error when filename empty', () => {
		const error = 'Error retrieving file extension'
		expect(() => extension('')).toThrow(error)
	})
})

describe('guess delimiter file functions', () => {
	it('guess delimiter default', () => {
		const filename = 'filename.csv'
		const expected = ','
		const result = guessDelimiter(filename)
		expect(result).toEqual(expected)
	})
	it('guess delimiter tsv', () => {
		const filename = 'filename.tsv'
		const expected = '\t'
		const result = guessDelimiter(filename)
		expect(result).toEqual(expected)
	})
	it('guess delimiter txt', () => {
		const filename = 'filename.txt'
		const expected = '\t'
		const result = guessDelimiter(filename)
		expect(result).toEqual(expected)
	})
})

describe('guess file type', () => {
	it('guess file type default', () => {
		const filename = 'filename.pdf'
		const expected = 'text/plain'
		const result = guessFileType(filename)
		expect(result).toEqual(expected)
	})
	it('guess file type with no extension', () => {
		const filename = 'filename'
		const expected = 'text/plain'
		const result = guessFileType(filename)
		expect(result).toEqual(expected)
	})
	it('guess file type json', () => {
		const filename = 'filename.json'
		const expected = 'application/json'
		const result = guessFileType(filename)
		expect(result).toEqual(expected)
	})
})

describe('validates if the file name is .zip', () => {
	it('isZipFile', () => {
		const filename = 'filename.zip'
		const expected = true
		const result = isZipFile(filename)
		expect(result).toEqual(expected)
	})
})

describe('validates if the file name is .json', () => {
	it('isJsonFile', () => {
		const filename = 'filename.json'
		const expected = true
		const result = isJsonFile(filename)
		expect(result).toEqual(expected)
	})
})

describe('validates if the file name is dsv', () => {
	it('isDsvFile csv', () => {
		const filename = 'filename.csv'
		const expected = true
		const result = isDsvFile(filename)
		expect(result).toEqual(expected)
	})
	it('isDsvFile tsv', () => {
		const filename = 'filename.tsv'
		const expected = true
		const result = isDsvFile(filename)
		expect(result).toEqual(expected)
	})
	it('isDsvFile txt', () => {
		const filename = 'filename.txt'
		const expected = true
		const result = isDsvFile(filename)
		expect(result).toEqual(expected)
	})
})

describe('validates if the file name is a table', () => {
	it('isTableFile csv', () => {
		const filename = 'filename.csv'
		const expected = true
		const result = isTableFile(filename)
		expect(result).toEqual(expected)
	})
	it('isTableFile tsv', () => {
		const filename = 'filename.tsv'
		const expected = true
		const result = isTableFile(filename)
		expect(result).toEqual(expected)
	})
	it('isTableFile txt', () => {
		const filename = 'filename.txt'
		const expected = true
		const result = isTableFile(filename)
		expect(result).toEqual(expected)
	})
	it('isTableFile arrow', () => {
		const filename = 'filename.arrow'
		const expected = true
		const result = isTableFile(filename)
		expect(result).toEqual(expected)
	})
})

describe('returns the content of a file as a string', () => {
	it('getTextFromFile', async () => {
		const blob = new Blob(['{"key": "value"}'])
		const file = new BaseFile(new FileWithPath(blob, 'file.json', './index.js'))
		const expected = '{"key": "value"}'
		const result = await getTextFromFile(file)
		expect(result).toEqual(expected)
	})
})

describe('returns the content of a file as JSON', () => {
	it('getJsonFileContentFromFile', async () => {
		const blob = new Blob(['{"key": "value"}'])
		const file = new BaseFile(new FileWithPath(blob, 'file.json', './index.js'))
		const expected = { key: 'value' }
		const result = await getJsonFileContentFromFile(file)
		expect(result).toEqual(expected)
	})

	it('throws error when file is not .json', async () => {
		const error = 'The provided file is not a json file'
		const blob = new Blob(['{"key": "value"}'])
		const file = new BaseFile(new FileWithPath(blob, 'file.txt', './index.js'))
		await expect(getJsonFileContentFromFile(file)).rejects.toThrow(error)
	})
})

describe('returns the content of a file as a DSV string', () => {
	it('getDsvFileContent', async () => {
		const blob = new Blob(['col1,col2\nA1,A2'])
		const file = new BaseFile(new FileWithPath(blob, 'file.csv', './index.js'))
		const expected = 'col1,col2\nA1,A2'
		const result = await getDsvFileContent(file)
		expect(result).toEqual(expected)
	})

	it('throws error when file is not DSV', async () => {
		const error = 'The provided file is not a dsv file'
		const blob = new Blob(['{"key": "value"}'])
		const file = new BaseFile(new FileWithPath(blob, 'file.json', './index.js'))
		await expect(getDsvFileContent(file)).rejects.toThrow(error)
	})
})

describe('returns the content of a file as a url string', () => {
	it('getDataURL', async () => {
		const blob = new Blob(['{"key": "value"}'])
		const file = new BaseFile(new FileWithPath(blob, 'file.json', './index.js'))
		const result = await getDataURL(file)
		expect(typeof result).toBe('string')
	})
})
