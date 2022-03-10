/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FileType } from '../../index.js'
import { createBaseFile } from '../../utils/index.js'
import { FileCollection } from '../FileCollection.js'

let fileCollection
const fileOpt = {
	type: 'application/json',
	name: 'file.json',
}
const jsonBlob = new Blob(['{"key": "value"}'])
const file = createBaseFile(jsonBlob, fileOpt)

beforeEach(() => {
	fileCollection = new FileCollection()
})

describe('new FileCollection()', () => {
	it('should create a FileCollection instance', () => {
		const instance = new FileCollection()
		expect(instance).toBeInstanceOf(FileCollection)
	})
})

describe('FileCollection.name', () => {
	it('should set the name of the FileCollection', () => {
		expect(fileCollection.name).toBe('')
		fileCollection.name = 'test'
		expect(fileCollection.name).toBe('test')
	})
})

describe('FileCollection.find', () => {
	it('should throw an error', () => {
		expect(() => fileCollection.find(file.name)).toThrow(
			`File ${file.name} not found`,
		)
	})
	it('should find a file by its name', () => {
		fileCollection.add(file)
		expect(fileCollection.find(file.name)).toEqual(file)
	})
})

describe('FileCollection.setFiles | FileCollection.list()', () => {
	it('should set and list the files', () => {
		const files = [file]
		expect(fileCollection.list()).toEqual([])
		fileCollection.setFiles([...files])
		expect(fileCollection.list()).toEqual(files)
	})
})

describe('FileCollection.add', () => {
	it('should add a file to the FileCollection', async () => {
		await fileCollection.add(file)
		expect(fileCollection.list()).toEqual([file])
	})

	it('should add a list of files to the FileCollection', async () => {
		const files = [file, file]
		await fileCollection.add(files)
		expect(fileCollection.list()).toEqual(files)
	})

	it('should add a file from a url to the FileCollection', async () => {
		await fileCollection.add(
			'https://cdn1.sph.harvard.edu/wp-content/uploads/sites/1268/1268/20/nhefs.csv',
		)
		expect(fileCollection.list()).toHaveLength(1)
	})
})

describe('FileCollection.remove', () => {
	it('should remove a file from the collection', async () => {
		const newFile = createBaseFile(jsonBlob, {
			...fileOpt,
			name: 'newFile.json',
		})
		const files = [file, newFile]
		await fileCollection.add(files)
		expect(fileCollection.list()).toEqual(files)
		fileCollection.remove({ name: 'file.json' })
		expect(fileCollection.list()).toEqual([newFile])
	})
	it('should remove all json files from the collection', async () => {
		await fileCollection.add([file, file])
		fileCollection.remove({ type: FileType.json })
		expect(fileCollection.list()).toEqual([])
	})
})

describe('FileCollection.clear', () => {
	it('should clear the collection', async () => {
		const files = [file, file]
		await fileCollection.add(files)
		expect(fileCollection.list()).toEqual(files)
		fileCollection.clear()
		expect(fileCollection.list()).toEqual([])
	})
})

describe('FileCollection.copy', () => {
	it('should make a copy of the collection', async () => {
		const files = [file, file]
		await fileCollection.add(files)
		fileCollection.name = 'OriginalCollection'
		const copy = fileCollection.copy()
		copy.name = 'CopyCollection'
		expect(copy).toBeInstanceOf(FileCollection)
		expect(fileCollection.name).toBe('OriginalCollection')
		expect(copy.name).toBe('CopyCollection')
	})
})
