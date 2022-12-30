/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import type { Resource } from '../Resource.js'
import { write } from './io.js'
import type { ResourceManager } from './ResourceManager.js'

export class SaveResourcesOperation {
	private _nameToPath = new Map<string, string>()

	public constructor(
		private mgr: ResourceManager,
		private files: Map<string, Blob>,
	) {}

	public async execute(): Promise<string[]> {
		const topResources = this.mgr.topResources
		await Promise.all(topResources.map(r => this.writeResource(r, '', true)))
		const topResourcePaths = (
			await Promise.all(
				topResources.map(r => this.writeResource(r, '', true, true)),
			)
		).filter(t => !!t) as string[]

		return topResourcePaths
	}

	private async writeResource(
		resource: Resource,
		prefix = '',
		top = false,
		resolve = false,
	): Promise<string | undefined | object> {
		if (resource.isReference()) {
			if (resource.target != null && resolve) {
				const path = this._nameToPath.get(resource.target?.name as string)
				if (path != null) {
					return { rel: resource.rel, path }
				}
			}
			return
		}

		const fileName = resource.name.endsWith('.json')
			? resource.name
			: `${resource.name}.json`
		const filePath = top ? `${fileName}/${fileName}` : `${prefix}${fileName}`

		const sources = await Promise.all(
			resource.sources.map(r =>
				this.writeResource(r, `${fileName}/`, false, resolve),
			),
		)

		if (resource.profile != null) {
			const handler = this.mgr.profileHandlers.get(resource.profile)
			if (handler?.save) {
				const extraSources = await handler.save(
					resource,
					top ? `${fileName}/` : prefix,
					this.files,
				)
				sources.push(...extraSources)
			}
		}

		this._nameToPath.set(resource.name, filePath)
		this.files.set(filePath, write(resource, { sources }))
		return filePath
	}
}
