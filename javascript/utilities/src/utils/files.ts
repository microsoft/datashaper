/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { BaseFile, FileWithPath } from '../common/index.js'
import { FileMimeType } from '../index.js'
import type { Json } from '../types.js'
import { FileType } from '../types.js'

interface FileOptions {
	name?: string
	path?: string
	type?: string
}

const fileDefaults = {
	name: 'File.txt',
	type: 'text/plain',
	path: '',
}

export function extension(filename = ''): string {
	const parts = filename.split('.')
	const ext = parts.pop()
	if (!ext) {
		throw Error('Error retrieving file extension')
	}
	return ext
}

export function guessDelimiter(filename = ''): string {
	const ext = extension(filename)
	switch (ext) {
		case 'tsv':
		case 'txt':
			return '\t'
		default:
			return ','
	}
}

export function isZipFile(fileName = ''): boolean {
	return fileName.toLowerCase().endsWith(FileType.zip)
}

export function isJsonFile(fileName = ''): boolean {
	return fileName.toLowerCase().endsWith(FileType.json)
}

export function isDsvFile(fileName = ''): boolean {
	return (
		fileName.toLowerCase().endsWith(FileType.csv) ||
		fileName.toLowerCase().endsWith(FileType.tsv) ||
		fileName.toLowerCase().endsWith(FileType.txt)
	)
}

export function isTableFile(fileName = ''): boolean {
	return isDsvFile(fileName) || fileName.toLowerCase().endsWith(FileType.arrow)
}

export function isSupportedFile(fileName = ''): boolean {
	const ext = extension(fileName)
	const supportedExtensions = Object.keys(FileType)
	return supportedExtensions.includes(ext)
}

export const fetchFile = async (url: string): Promise<Blob> => {
	return fetch(url).then(response => response.blob())
}

export function guessFileType(name: string): string {
	try {
		const ext = extension(name)
		const type = FileMimeType[ext as keyof typeof FileMimeType]
		if (type) {
			return type
		}
	} catch {
		return fileDefaults.type
	}
	return fileDefaults.type
}

export const createFile = (
	content: Blob,
	options?: Omit<FileOptions, 'path'>,
): File => {
	const { name } = { ...fileDefaults, ...options }
	const type = options?.type || guessFileType(name)
	return new File([content], name, { type })
}

export const createFileWithPath = (
	content: Blob,
	options?: FileOptions,
): FileWithPath => {
	const { name, path } = { ...fileDefaults, ...options }
	const file = createFile(content, options)
	return new FileWithPath(file, name, path || name)
}

export const createBaseFile = (
	content: Blob,
	options?: FileOptions,
): BaseFile => {
	const file = createFileWithPath(content, options)
	return new BaseFile(file)
}

function createReader() {
	const reader = new FileReader()
	reader.onabort = () => console.log('file reading was aborted')
	reader.onerror = () => console.log('file reading has failed')
	return reader
}

export const getTextFromFile = async (file: BaseFile): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		const reader = createReader()
		reader.onload = () => {
			try {
				resolve(reader.result as string)
			} catch (e) {
				reject(e)
			}
		}
		reader.readAsText(file)
	})
}

export const getJsonFileContentFromFile = async (
	file: BaseFile,
): Promise<Json> => {
	if (!isJsonFile(file?.name)) {
		throw Error('The provided file is not a json file')
	}
	const text = await getTextFromFile(file)
	return JSON.parse(text)
}

export const getDsvFileContent = async (file: BaseFile): Promise<string> => {
	if (!isDsvFile(file?.name)) {
		throw Error('The provided file is not a dsv file')
	}
	return getTextFromFile(file)
}

export async function getDataURL(file: BaseFile): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = createReader()
		reader.onload = () => {
			try {
				resolve(reader.result as string)
			} catch (e) {
				reject(e)
			}
		}
		reader.readAsDataURL(file)
	})
}

export function renameDuplicatedFiles(files: BaseFile[]): BaseFile[] {
	const fileNames: Record<string, number> = {}
	const cleanName = (name: string): string => {
		const ext = extension(name)
		const clean = name
			.replace(`.${ext}`, '')
			.replace(/\([0-9]\)/g, '')
			.trimEnd()
		return `${clean}.${ext}`
	}
	const names = files.map(file => cleanName(file.name))
	for (const name of names) {
		if (!fileNames[name]) {
			fileNames[name] = 0
		}
		++fileNames[name]
	}
	const values = Object.values(fileNames)
	if (values.every(val => val === 1)) {
		return files
	}
	return files.map(file => {
		let name = cleanName(file.name)
		const count = fileNames[name]
		--fileNames[name]
		if (count > 1) {
			const ext = extension(name)
			name = `${name.replace(`.${ext}`, '')} (${count}).${ext}`
		}
		return createBaseFile(file, { name })
	})
}
