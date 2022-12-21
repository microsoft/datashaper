/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'

import { fetchFile } from '../util/network.js'
import { isResourceRelationship } from './predicates.js'

export const isRawData = (
	r: string | ResourceSchema,
	files: Map<string, Blob>,
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
	files: Map<string, Blob>,
): Promise<ResourceSchema | undefined> {
	// if the item is a string, look up the resource in the files map
	return typeof item === 'string' ? parseFileContent(item, files) : item
}

export async function findRel<T extends ResourceSchema = ResourceSchema>(
	rel: string,
	resource: ResourceSchema,
	files: Map<string, Blob>,
): Promise<T | undefined> {
	console.log('find rel', rel, files)
	if (resource.sources) {
		for (const source of resource.sources) {
			if (isResourceRelationship(source) && source.rel === rel) {
				if (source.source) {
					// Return an embedded source
					const result = await toResourceSchema(source.source, files)
					return result as T
				}
			}
		}
	}
}

async function parseFileContent(item: string, files: Map<string, Blob>) {
	// if the item is a string, look up the resource in the files map
	const blob = resolveRawContent(item, files)
	const resourceText = await blob?.text()
	if (resourceText == null) return undefined
	try {
		return JSON.parse(resourceText)
	} catch (e) {
		console.error(`error parsing resource ${item}`, e)
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
	const locallyResolved = resolveRawContent(resource, files)
	if (locallyResolved) {
		return Promise.resolve(locallyResolved)
	} else {
		return fetchFile(resource)
	}
}

function resolveRawContent(
	resource: string,
	files: Map<string, Blob>,
): Blob | undefined {
	if (files.has(resource)) {
		return files.get(resource)
	}
}
