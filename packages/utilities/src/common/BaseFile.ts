/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { Json } from '../types'
import {
	getDsvFileContent,
	getJsonFileContentFromFile,
	getTextFromFile,
	isDsvFile,
	isJsonFile,
	isSupportedFile,
	isTableFile,
	isZipFile,
	loadTable,
	getDataURL,
} from '../utils'
import { FileWithPath } from './FileWithPath'

export class BaseFile extends FileWithPath {
	constructor(private file: FileWithPath) {
		super(file, file.name, file.path)
	}

	get name(): string {
		return this.file.name
	}

	isJson(): boolean {
		return isJsonFile(this.name)
	}

	isDsv(): boolean {
		return isDsvFile(this.name)
	}

	isZip(): boolean {
		return isZipFile(this.name)
	}

	isTable(): boolean {
		return isTableFile(this.name)
	}

	isSupported(): boolean {
		return isSupportedFile(this.name)
	}

	isReadable(): boolean {
		return this.isDsv() || this.isJson()
	}

	async toJson(): Promise<Json> {
		return getJsonFileContentFromFile(this)
	}

	async toText(): Promise<string> {
		return getTextFromFile(this)
	}

	async toDsvString(): Promise<string> {
		return getDsvFileContent(this)
	}

	async toTable(): Promise<ColumnTable> {
		if (!this.isDsv()) {
			throw Error('The provided file is not a dsv file')
		}
		return loadTable(this)
	}

	async toDataURL(): Promise<string> {
		return getDataURL(this)
	}

	metadata(): Json {
		const meta: Json = {}
		for (const key in this) {
			meta[key] = this[key]
		}
		return {
			...meta,
			path: this.path,
			name: this.name,
			isJson: this.isJson(),
			isDsv: this.isDsv(),
			isZip: this.isZip(),
			isTable: this.isTable(),
			isReadable: this.isReadable(),
			isSupported: this.isSupported(),
		}
	}

	rename(newName: string): void {
		const path = this.path.replace(this.name, newName)
		const renamedFile = new FileWithPath(this.file, newName, path)
		this.file = renamedFile
		this.path = path
	}
}
