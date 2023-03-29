/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile, WorkflowSchema } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'

import type { ProfileHandler } from '../../types/index.js'
import { Workflow } from '../../Workflow/index.js'

export class WorkflowProfile implements ProfileHandler<Workflow, WorkflowSchema> {
	public readonly profile: Profile = KnownProfile.Workflow

	public createInstance(schema: WorkflowSchema | undefined): Promise<Workflow> {
		return Promise.resolve(new Workflow(schema))
	}

	public save(
		data: Workflow,
		dataPath: string,
		files: Map<string, Blob>,
	): Promise<string[]> {
		const result: string[] = []
		if (data.output?.table) {
			const path = `${dataPath}output.csv`
			result.push(path)
			files.set(path, new Blob([data.output.table.toCSV()]))
		}
		return Promise.resolve(result)
	}
}
