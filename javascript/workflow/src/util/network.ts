/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debug from 'debug'

const log = debug('datashaper:network')

export async function fetchFile(url: string): Promise<Blob> {
	log('fetching file', url)
	try {
		const response = await fetch(url)
		log(`fetched file [${response.status}]`, url)
		return response.blob()
	} catch (e) {
		log('error fetching file', url, e)
		throw e
	}
}

export async function fetchJson<T = any>(url: string): Promise<T> {
	log('fetching json', url)
	try {
		const response = await fetch(url)
		log(`fetched json [${response.status}]`, url)
		return response.json()
	} catch (e) {
		log('error fetching json', url, e)
		throw e
	}
}
