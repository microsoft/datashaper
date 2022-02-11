/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Entry } from '@zip.js/zip.js'
import { FileWithPath } from '../../common/index.js'
import { getBlobFromEntry, getFileFromEntry, toZip } from '../zip'

describe('gets the blob of a zip.Entry', () => {
	it('getBlobFromEntry', async () => {
		const entry = { filename: 'foo.txt' } as Entry
		const result = await getBlobFromEntry(entry)
		expect(result).toBeInstanceOf(Blob)
	})
})

describe('returns a FileWithPath instance from a Entry', () => {
	it('getFileFromEntry', async () => {
		const entry = { filename: 'foo.txt' } as Entry
		const result = await getFileFromEntry(entry)
		expect(result).toBeInstanceOf(FileWithPath)
	})
})

describe('creates a Zip file', () => {
	it('toZip', async () => {
		const file = (txt: string) =>
			new File([txt], `${txt}.txt`, { type: 'text/plain' })
		const files = [file('foo'), file('`bar')]
		const result = await toZip(files, { useWebWorkers: false })
		expect(typeof result).toBe('string')
		expect(result).toContain('application/zip')
	})
})
