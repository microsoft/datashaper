/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { BaseFile } from '../common'
import { FileType, Json } from '../types'

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

export const getTextFromFile = async (file: BaseFile): Promise<string> => {
	const reader = new FileReader()
	reader.readAsText(file)
	return new Promise<string>((resolve, reject) => {
		reader.onload = () => {
			resolve(reader.result as string)
		}
		reader.onerror = reject
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
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			resolve(reader.result as string)
		}
		reader.onerror = reject
	})
}

export async function renameDuplicatedFiles(
	files: BaseFile[],
): Promise<BaseFile[]> {
	const fileNames: Record<string, number> = {}
	for (const file of files) {
		if (!fileNames[file.name]) {
			fileNames[file.name] = 0
		}
		++fileNames[file.name]
	}
	const values = Object.values(fileNames)
	if (values.every(val => val === 1)) {
		return files
	}
	files.forEach(file => {
		--fileNames[file.name]
		const count = fileNames[file.name]
		const ext = extension(file.name)
		const name = file.name.replace(`.${ext}`, '')
		const newName = !!count ? `${name}_${count}.${ext}` : file.name
		file.rename(newName)
	})
	return files
}
