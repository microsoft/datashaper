/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'
import fetch from 'cross-fetch'

export const isWorkflow = (r: ResourceSchema): boolean =>
	r.profile === 'workflow' || r.$schema.indexOf('/workflow/') > -1

export const isCodebook = (r: ResourceSchema): boolean =>
	r.profile === 'codebook' || r.$schema.indexOf('/codebook/') > -1

export const isDataTable = (r: ResourceSchema): boolean =>
	r.profile === 'datatable' || r.$schema.indexOf('/datatable/') > -1

export const isRawData = (
	r: string | ResourceSchema,
	files?: Map<string, Blob>,
): boolean => {
	if (typeof r === 'string') {
		if (r.endsWith('.csv') || r.endsWith('.tsv') || r.endsWith('.arrow')) {
			return true
		}
		if (r.endsWith('.json')) {
			// parse and check type
			const item = parseFileContent(r, files)
			return Array.isArray(item)
		}
	} else {
		// raw data may be specified with arrays
		return Array.isArray(r)
	}
	return false
}

export async function toResourceSchema(
	item: string | ResourceSchema,
	files?: Map<string, Blob>,
): Promise<ResourceSchema | undefined> {
	// if the item is a string, look up the resource in the files map
	return typeof item === 'string' ? parseFileContent(item, files) : item
}

async function parseFileContent(item: string, files?: Map<string, Blob>) {
	// if the item is a string, look up the resource in the files map
	const resourceText = await files?.get(item)?.text()
	if (resourceText == null) return undefined
	try {
		return JSON.parse(resourceText)
	} catch (e) {
		console.error('error parsing resource ' + item, e)
		return undefined
	}
}

/**
 * Resolves a data resource string. If it can be found in the files array,
 * then we use that. If not, we assume it's a URL and try to fetch it.
 *
 * @param resource - The resource string
 * @param files - The available files
 * @returns The resolved data resource
 */
export function resolveRawData(
	resource: string,
	files: Map<string, Blob>,
): Promise<Blob> {
	const locallyResolved = files.get(resource)
	if (locallyResolved) {
		return Promise.resolve(locallyResolved)
	} else {
		if (!resource.startsWith('http')) {
			throw new Error('Invalid resource URL: ' + resource)
		}
		return fetch(resource).then(r => r.blob())
	}
}
