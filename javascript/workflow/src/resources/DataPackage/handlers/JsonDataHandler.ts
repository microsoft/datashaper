/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'

import type { Resource } from '../../Resource.js'
import type { ResourceHandler } from '../../types.js'
import { toBlob } from '../io.js'

export class JsonDataHandler<T extends Resource> implements ResourceHandler {
	public constructor(
		public readonly profile: string,
		private readonly createResource: () => T,
	) {}

	public save(resource: T, files: Map<string, Blob>): Promise<string[]> {
		// write out the resource JSON as a blob
		const data = resource.toSchema()
		const filename = `${data.name}.json`
		files.set(filename, toBlob(data))
		return Promise.resolve([filename])
	}

	public load(data: ResourceSchema): Promise<Resource[]> {
		const resource = this.createResource()
		resource.loadSchema(data)
		return Promise.resolve([resource])
	}
}
