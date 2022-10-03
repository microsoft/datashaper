/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'

export const isWorkflow = (r: ResourceSchema): boolean =>
	r.$schema.indexOf('/workflow/') > -1

export const isCodebook = (r: ResourceSchema): boolean =>
	r.$schema.indexOf('/codebook/') > -1

export const isDataTable = (r: ResourceSchema): boolean =>
	r.$schema.indexOf('/datatable/') > -1

export const isRawData = (r: string | ResourceSchema): boolean =>
	typeof r === 'string' &&
	(r.endsWith('.csv') ||
		r.endsWith('.tsv') ||
		r.endsWith('.json') ||
		r.endsWith('.arrow'))

export async function toResourceSchema(
	item: string | ResourceSchema,
	files?: Map<string, Blob>,
): Promise<ResourceSchema | undefined> {
	// if the item is a string, look up the resource in the files map
	if (typeof item === 'string') {
		const resourceText = await files?.get(item)?.text()
		if (resourceText == null) return undefined
		try {
			return JSON.parse(resourceText)
		} catch (e) {
			console.error('error parsing resource ' + item, e)
			return undefined
		}
	}
	return item
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
	return locallyResolved
		? Promise.resolve(locallyResolved)
		: fetch(resource).then(r => r.blob())
}
