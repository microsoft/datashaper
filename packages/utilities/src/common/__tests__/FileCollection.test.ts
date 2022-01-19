/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createBaseFile, createFileWithPath } from '../../utils'
import { FileCollection } from '../FileCollection'

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

describe('creates fileCollection instance', () => {
	it('new FileCollection()', async () => {
		expect(fileCollection.list()).toEqual([])
	})
})

describe('rename fileCollection instance', () => {
	it('set FileCollection name', async () => {
		expect(fileCollection.name).toBe('')
		fileCollection.name = 'test'
		expect(fileCollection.name).toBe('test')
	})
})

describe('set and list fileCollection files', () => {
	it('FileCollection list', async () => {
		const files = [file]
		expect(fileCollection.list()).toEqual([])
		fileCollection.files = [...files]
		expect(fileCollection.list()).toEqual(files)
	})
})

describe('init fileCollection', () => {
	it('FileCollection init', async () => {
		const files = [file, file]
		const fileWithPath = createFileWithPath(jsonBlob, {
			...fileOpt,
			name: 'file.json',
		})
		await fileCollection.init([fileWithPath, fileWithPath])
		expect(fileCollection.list()).toEqual(files)
	})
})

describe('add file to fileCollection', () => {
	it('FileCollection add', async () => {
		const files = [file]
		const newFile = createFileWithPath(jsonBlob, {
			...fileOpt,
			name: 'newFile.json',
		})
		const newBaseFile = createBaseFile(jsonBlob, {
			...fileOpt,
			name: 'newFile.json',
		})
		fileCollection.files = [...files]
		expect(fileCollection.list()).toEqual(files)
		await fileCollection.add(newFile)
		expect(fileCollection.list()).toEqual([file, newBaseFile])
	})
})

describe('remove file form fileCollection', () => {
	it('FileCollection remove', async () => {
		const newFile = createBaseFile(jsonBlob, {
			...fileOpt,
			name: 'newFile.json',
		})
		const files = [file, newFile]
		fileCollection.files = [...files]
		expect(fileCollection.list()).toEqual(files)
		fileCollection.remove({ name: 'file.json' })
		expect(fileCollection.list()).toEqual([newFile])
	})
})

describe('clear files form fileCollection', () => {
	it('FileCollection clear', async () => {
		const files = [file, file]
		fileCollection.files = [...files]
		expect(fileCollection.list()).toEqual(files)
		fileCollection.clear()
		expect(fileCollection.list()).toEqual([])
	})
})

describe('copy fileCollection', () => {
	it('FileCollection copy', async () => {
		const files = [file, file]
		fileCollection.files = [...files]
		fileCollection.name = 'OriginalCollection'
		const copy = fileCollection.copy()
		copy.name = 'CopyCollection'
		expect(copy).toBeInstanceOf(FileCollection)
		expect(fileCollection.name).toBe('OriginalCollection')
		expect(copy.name).toBe('CopyCollection')
	})
})
