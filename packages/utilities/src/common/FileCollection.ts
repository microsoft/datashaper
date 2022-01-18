/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { HTMLFormatOptions } from 'arquero/dist/types/format/to-html'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { FileType, Json } from '../types'
import {
	fetchFile,
	getFilesFromZip,
	isZipFile,
	loadTable,
	renameDuplicatedFiles,
	tableToHTML,
	toZip,
} from '../utils'
import { BaseFile } from './BaseFile'
import { FileWithPath } from './FileWithPath'

export class FileCollection {
	private _files: BaseFile[] = []
	private supportedFilesOnly = false
	private _name = ''

	set files(files: BaseFile[]) {
		this._files = files
	}

	set name(name: string) {
		const nonExtName = name.replace(/\.[^/.]+$/, '')
		this._name = nonExtName
	}

	get name(): string {
		return this._name
	}

	async init(files: FileWithPath[] | string): Promise<void> {
		if (!files.length) {
			throw new Error('No files provided')
		}

		if (typeof files === 'string') {
			const blob = await fetchFile(files)
			const filesFromZip = await getFilesFromZip(blob)
			this._files = filesFromZip.map(f => new BaseFile(f))
			this.name = files
		} else if ((files as File[]).every(file => file instanceof File)) {
			let baseFiles: BaseFile[] = []
			for await (const file of files as FileWithPath[]) {
				if (!isZipFile(file.name)) {
					baseFiles = [...baseFiles, new BaseFile(file)]
				} else {
					this.name = file.name
					const filesFromZip = await getFilesFromZip(file)
					baseFiles = [
						...baseFiles,
						...filesFromZip.map((f: FileWithPath) => new BaseFile(f)),
					]
				}
			}
			this._files = [...baseFiles]
		}
	}

	private find(name: string): BaseFile {
		const file = this._files.find(file => file.name === name)
		if (!file) {
			throw new Error(`File ${name} not found`)
		}
		return file
	}

	private filtered(files = this._files): BaseFile[] {
		if (this.supportedFilesOnly) {
			return files.filter(file => file.isSupported())
		}
		return files
	}

	showOnlySupportedFiles(value: boolean): void {
		this.supportedFilesOnly = value
	}

	list(type?: FileType): BaseFile[] {
		let files: BaseFile[] = this._files
		if (type === FileType.table) {
			files = this._files.filter(file => file.isTable())
		} else if (type) {
			files = this._files.filter(file => file.name.endsWith(type))
		}
		return this.filtered(files)
	}

	async toDsv(name: string): Promise<string> {
		return this.find(name).toDsvString()
	}

	async toJson(name: string): Promise<Json> {
		return this.find(name).toJson()
	}

	async toTable(name: string): Promise<ColumnTable> {
		return loadTable(this.find(name))
	}

	private async _add(file: FileWithPath): Promise<void> {
		if (!isZipFile(file.name)) {
			this._files = [...this._files, new BaseFile(file)]
		} else {
			const files = await getFilesFromZip(file)
			this._files = [...this._files, ...files.map(f => new BaseFile(f))]
		}
	}

	async add(files: FileWithPath[] | FileWithPath): Promise<void> {
		if (files instanceof File || files instanceof FileWithPath) {
			files = [files]
		}
		await Promise.all(files.map(file => this._add(file)))
	}

	remove(options: { type?: FileType; name?: string }): void {
		const { type, name } = options
		if (name) {
			this._files = this._files.filter(file => file.name !== name)
		} else if (type) {
			const files = this.list(type).map(file => file.name)
			this._files = this._files.filter(file => !files.includes(file.name))
		}
	}

	clear(): void {
		this._files = []
	}

	metadata(name: string): Json {
		return this.find(name).metadata()
	}

	rename(name: string, newName: string): void {
		const file = this.find(name)
		file.rename(newName)
		this._files = [...this._files]
	}

	async toHtml(name: string): Promise<string> {
		const options: HTMLFormatOptions = {
			style: {
				table:
					'text-align: center; min-width: 100%; table-layout: fixed; border-collapse:collapse;',
				th: 'border: 1px solid; padding: 5px;',
				td: 'border: 1px solid; padding: 5px;',
			},
		}
		const html = await tableToHTML(this.find(name), options)
		return html
	}

	async toZip(zipName = 'file-collection'): Promise<void> {
		this._files = renameDuplicatedFiles(this._files)
		const dataURI = await toZip(this.filtered())
		const link = document.createElement('a')
		link.href = dataURI
		link.download = `${this.name || zipName}.zip`
		link.click()
	}

	copy(): FileCollection {
		const newFC = new FileCollection()
		newFC.name = this.name
		newFC.files = [...this._files]
		return newFC
	}
}
