/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { HTMLFormatOptions } from 'arquero/dist/types/format/to-html'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { FileType, Json } from '../types.js'
import {
	createFileWithPath,
	fetchFile,
	getFilesFromZip,
	isZipFile,
	loadTable,
	renameDuplicatedFiles,
	tableToHTML,
	toZip,
} from '../utils/index.js'
import { BaseFile } from './BaseFile.js'
import { FileWithPath } from './FileWithPath.js'

interface Config {
	supportedFilesOnly?: boolean
}
export class FileCollection {
	private _files: BaseFile[] = []
	private _name = ''
	private _config: Config = {
		supportedFilesOnly: false,
	}

	set name(name: string) {
		const nonExtName = name.replace(/\.[^/.]+$/, '')
		this._name = nonExtName
	}

	get name(): string {
		return this._name
	}

	set config(config: Config) {
		this._config = { ...this._config, ...config }
	}

	private async _addFromZip(file: FileWithPath | File) {
		if (!this.name) {
			this.name = file.name
		}
		const filesFromZip = await getFilesFromZip(file)
		this._files = [...this._files, ...filesFromZip.map(f => new BaseFile(f))]
	}

	private async _addFile(file: FileWithPath | File): Promise<void> {
		const { name } = file
		if (file instanceof File) {
			file = createFileWithPath(file, { name })
		}

		if (isZipFile(name)) {
			return this._addFromZip(file)
		}
		this._files = [...this._files, new BaseFile(file as FileWithPath)]
	}

	private async _addFromUrl(fileUrl: string): Promise<void> {
		const name = fileUrl.split('/').pop() || ''
		const blob = await fetchFile(fileUrl)
		const file = createFileWithPath(blob, { name })
		return this._addFile(file)
	}

	private async _addFromArray(files: (FileWithPath | File)[]): Promise<void> {
		if ((files as File[]).every(file => file instanceof File)) {
			for await (const file of files as FileWithPath[]) {
				await this._addFile(file)
			}
		}
	}

	setFiles(files: BaseFile[]): void {
		this._files = files
	}

	find(name: string): BaseFile {
		const file = this._files.find(file => file.name === name)
		if (!file) {
			throw new Error(`File ${name} not found`)
		}
		return file
	}

	private filtered(files = this._files): BaseFile[] {
		if (this._config.supportedFilesOnly) {
			return files.filter(file => file.isSupported())
		}
		return files
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

	async add(files: FileWithPath[] | FileWithPath | string): Promise<void> {
		if (!files) {
			throw new Error('No files provided')
		}
		if (files instanceof File || files instanceof FileWithPath) {
			return this._addFile(files)
		} else {
			if (!files.length) {
				throw new Error('No files provided')
			}
			if (Array.isArray(files)) {
				return this._addFromArray(files)
			}
			return this._addFromUrl(files)
		}
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
		newFC.setFiles([...this._files])
		return newFC
	}
}
