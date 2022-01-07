/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { HTMLFormatOptions } from 'arquero/dist/types/format/to-html'
import ColumnTable from 'arquero/dist/types/table/column-table'
import {
	fetchFile,
	getFilesFromZip,
	isZipFile,
	loadTable,
	tableToHTML,
	toZip,
} from '../utils'
import { BaseFile } from './BaseFile'
import { FileType } from './FileType'
import { FileWithPath } from './FileWithPath'
import { Json } from './Json'

export class FileCollection {
	files: BaseFile[] = []
	private supportedFilesOnly = false

	async init(files: FileWithPath[] | string): Promise<void> {
		if (!files.length) {
			throw new Error('No files provided')
		}

		if (typeof files === 'string') {
			const blob = await fetchFile(files)
			const filesFromZip = await getFilesFromZip(blob)
			this.files = filesFromZip.map(f => new BaseFile(f))
		} else if ((files as File[]).every(file => file instanceof File)) {
			let baseFiles: BaseFile[] = []
			for await (const file of files as FileWithPath[]) {
				if (!isZipFile(file.name)) {
					baseFiles = [...baseFiles, new BaseFile(file)]
				} else {
					const filesFromZip = await getFilesFromZip(file)
					baseFiles = [
						...baseFiles,
						...filesFromZip.map((f: FileWithPath) => new BaseFile(f)),
					]
				}
			}
			this.files = [...baseFiles]
		}
	}

	private find(name: string): BaseFile {
		const file = this.files.find(file => file.name === name)
		if (!file) {
			throw new Error(`File ${name} not found`)
		}
		return file
	}

	private filtered(files = this.files): BaseFile[] {
		if (this.supportedFilesOnly) {
			return files.filter(file => file.isSupported())
		}
		return files
	}

	showOnlySupportedFiles(value: boolean): void {
		this.supportedFilesOnly = value
	}

	list(type?: FileType): BaseFile[] {
		let files: BaseFile[] = this.files
		if (type === FileType.table) {
			files = this.files.filter(file => file.isTable())
		} else if (type) {
			files = this.files.filter(file => file.name.endsWith(type))
		}
		return this.filtered(files)
	}

	async dsv(name: string): Promise<string> {
		return this.find(name).getDsvString()
	}

	async json(name: string): Promise<Json> {
		return this.find(name).getJson()
	}

	async table(name: string): Promise<ColumnTable> {
		return loadTable(this.find(name))
	}

	async add(file: FileWithPath): Promise<void> {
		if (!isZipFile(file.name)) {
			this.files = [...this.files, new BaseFile(file)]
			return
		}
		const files = await getFilesFromZip(file)
		this.files = [...this.files, ...files.map(f => new BaseFile(f))]
	}

	remove(name: string): void {
		this.files = this.files.filter(file => file.name !== name)
	}

	metadata(name: string): Json {
		return this.find(name).metadata()
	}

	async rename(name: string, newName: string): Promise<void> {
		const file = this.find(name)
		await file.rename(newName)
		this.files = [...this.files]
	}

	async htmlTable(name: string): Promise<string> {
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

	async zip(zipName = 'file-collection'): Promise<void> {
		const dataURI = await toZip(this.filtered())
		const link = document.createElement('a')
		link.href = dataURI
		link.download = `${zipName}.zip`
		link.click()
	}
}
