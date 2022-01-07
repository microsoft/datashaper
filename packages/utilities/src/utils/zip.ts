/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import * as zip from '@zip.js/zip.js'
import { FileWithPath } from '../common'

export async function getFilesFromZip(zipFile: Blob): Promise<FileWithPath[]> {
	const reader = new zip.BlobReader(zipFile)
	const zipReader = new zip.ZipReader(reader)
	/* eslint-disable @essex/adjacent-await */
	const entries = await zipReader.getEntries()
	await zipReader.close()
	return Promise.all(entries.map(entry => getFileFromEntry(entry)))
}

export async function getBlobFromEntry(entry: zip.Entry): Promise<Blob> {
	const writer = new zip.BlobWriter()
	const blob = entry.getData ? await entry.getData(writer) : new Blob()
	return blob
}

export async function getFileFromEntry(
	entry: zip.Entry,
): Promise<FileWithPath> {
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
	const zipWriter = new zip.ZipWriter(
		new zip.Data64URIWriter('application/zip'),
		writerOptions,
	)
	for (const file of files) {
		await zipWriter.add(file.name, new zip.BlobReader(file))
	}
	const dataURI = await zipWriter.close()
	return dataURI
}
