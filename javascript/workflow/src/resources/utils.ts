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
			const item = readResource(r, files)
			return Array.isArray(item)
		}
	} else {
		// raw data may be specified with arrays
		return Array.isArray(r)
	}
	return false
}


export async function findRel<T extends ResourceSchema = ResourceSchema>(
	rel: string,
	resource: ResourceSchema,
	files: Map<string, Blob>,
	cache: Map<string, ResourceSchema>,
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
					const result = await resolveResource(resourceTarget, files, cache)
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
