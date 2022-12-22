/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'

import { fetchFile } from '../util/network.js'
import { isDataTableSchema } from './predicates.js'

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
	if (resource.sources) {
		for (const source of resource.sources) {
			if (typeof source !== 'string') {
				if (
					(source.rel != null && source.rel === rel) ||
					source.profile === rel
				) {
					const resourceTarget = isReferencedResource(source)
						? (source.path as string)
						: source
					const result = await toResourceSchema(resourceTarget, files)
					return result as T
				}
			}
		}
	}
}

function isReferencedResource(source: ResourceSchema): boolean {
	// TODO: register path-handling logic on a per-schema basis?
	if (isDataTableSchema(source)) {
		// data-tables may reference their sourcedata using the 'path' string.
		// If raw data is not referenced, we're referencing the resource
		return (
			typeof source.path === 'string' &&
			!(
				source.path.endsWith('.csv') ||
				source.path.endsWith('.tsv') ||
				source.path.endsWith('.arrow') ||
				source.path.endsWith('.parquet')
			)
		)
	}
	// may be remote (https://... or local resource name)
	return typeof source.path === 'string'
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
