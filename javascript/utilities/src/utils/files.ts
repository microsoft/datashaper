/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import fetch from 'cross-fetch'
import debug from 'debug'

import { BaseFile, FileWithPath } from '../common/index.js'
import { FileMimeType } from '../index.js'
import type { Json } from '../types.js'
import { FileType } from '../types.js'

const log = debug('datashaper')

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

/**
 * @deprecated - use @datashaper/workflow fetchFile, fetchJson instead.
 * @param url - the resource url
 * @returns
 */
export async function fetchFile(url: string): Promise<Blob> {
	log('utils fetching file', url)
	try {
		const response = await fetch(url)
		log(`utils fetched file [${response.status}]`, url)
		return response.blob()
	} catch (e) {
		log('utils error fetching file', url, e)
		throw e
	}
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

export function createReader(): FileReader {
	const reader = new FileReader()
	reader.onabort = () => log('file reading was aborted')
	reader.onerror = () => log('file reading has failed')
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
	const names = files.map(file => file.name)
	if (!hasDuplicatedNames(names)) {
		return files
	}

	const map = new Map<string, number>()
	return files.map(file => {
		const name = renameDuplicatedFileName(map, file.name)
		return createBaseFile(file, { name })
	})
}

export function renameDuplicatedFileName(
	map: Map<string, number>,
	name: string,
): string {
	const cleanName = cleanFileName(name)
	const next = (map.get(cleanName) || 0) + 1
	map.set(cleanName, next)
	const ext = extension(cleanName)
	const basename = cleanName.replace(`.${ext}`, '')
	return next > 1 ? `${basename} (${next}).${ext}` : cleanName
}

function hasDuplicatedNames(names: string[]): boolean {
	const uniqueNames = new Set<string>(names)
	return uniqueNames.size < names.length
}

function cleanFileName(name: string): string {
	const ext = extension(name)
	const clean = name
		.replace(`.${ext}`, '')
		.replace(/\([0-9]\)/g, '')
		.trimEnd()
	return `${clean}.${ext}`
}
