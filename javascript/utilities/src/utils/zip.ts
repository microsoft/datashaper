/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Entry } from '@zip.js/zip.js'
import {
	BlobReader,
	ZipReader,
	BlobWriter,
	ZipWriter,
	Data64URIWriter,
} from '@zip.js/zip.js'
import { FileWithPath } from '../common/index.js'

export async function getFilesFromZip(zipFile: Blob): Promise<FileWithPath[]> {
	const reader = new BlobReader(zipFile)
	const zipReader = new ZipReader(reader)
	/* eslint-disable @essex/adjacent-await */
	const entries = await zipReader.getEntries()
	await zipReader.close()
	return Promise.all(entries.map(entry => getFileFromEntry(entry)))
}

export async function getBlobFromEntry(entry: Entry): Promise<Blob> {
	const writer = new BlobWriter()
	const blob = entry.getData ? await entry.getData(writer) : new Blob()
	return blob
}

export async function getFileFromEntry(entry: Entry): Promise<FileWithPath> {
	const blob = await getBlobFromEntry(entry)
	return new FileWithPath(
		blob,
		entry.filename.split('/').pop() || '',
		entry.filename,
	)
}

export async function toZip(
	files: File[],
	writerOptions?: Record<string, any>,
): Promise<string> {
	const zipWriter = new ZipWriter(
		new Data64URIWriter('application/zip'),
		writerOptions,
	)
	for (const file of files) {
		await zipWriter.add(file.name, new BlobReader(file))
	}
	const dataURI = await zipWriter.close()
	return dataURI
}
