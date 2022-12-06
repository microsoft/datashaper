/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema } from '../codebook/CodebookSchema.js'
import type { ResourceSchema } from '../datapackage/ResourceSchema.js'
import type { DataTableSchema } from '../datatable/DataTableSchema.js'
import type { KnownProfile } from '../Profile.js'
import type { WorkflowSchema } from '../workflow/WorkflowSchema.js'

export interface TableBundleSchema extends ResourceSchema {
	profile: KnownProfile.TableBundle

	/**
	 * The sources that compose a table bundle.
	 */
	sources?: Array<
		| {
				rel: TableBundleRel.Input
				source: string | DataTableSchema
		  }
		| {
				rel: TableBundleRel.Codebook
				source: string | CodebookSchema
		  }
		| {
				rel: TableBundleRel.Workflow
				source: string | WorkflowSchema
		  }
	>
}

export enum TableBundleRel {
	Input = 'input',
	Codebook = 'codebook',
	Workflow = 'workflow',
}
