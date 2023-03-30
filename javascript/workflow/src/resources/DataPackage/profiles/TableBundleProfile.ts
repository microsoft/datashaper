/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile, TableBundleSchema } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'

import { TableBundle } from '../../TableBundle.js'
import type { ProfileHandler } from '../../types/index.js'

export class TableBundleProfile
	implements ProfileHandler<TableBundle, TableBundleSchema>
{
	public readonly profile: Profile = KnownProfile.TableBundle

	public createInstance(schema?: TableBundleSchema): Promise<TableBundle> {
		const result = new TableBundle(schema)
		if (schema?.name == null) {
			result.name = 'Table Bundle'
		}
		return Promise.resolve(result)
	}

	public save(
		data: TableBundle,
		dataPath: string,
		files: Map<string, Blob>,
	): Promise<string[]> {
		const result: string[] = []
		if (data.output?.table) {
			const path = `${dataPath}${data.name || 'output'}.csv`
			result.push(path)
			files.set(path, new Blob([data.output.table.toCSV()]))
		}
		return Promise.resolve(result)
	}
}
