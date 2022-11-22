/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema } from '../codebook/CodebookSchema.js'
import type { ResourceSchema } from '../datapackage/ResourceSchema.js'
import type { DataTableSchema } from '../datatable/DataTableSchema.js'
import type { WorkflowSchema } from '../workflow/WorkflowSchema.js'

/**
 * This defines the data-bundle schema, which is a collection of table-centric resources.
 * The data-table represents the data-source and parsing options.
 * The codebook represents interpretation options and data-type mappings.
 * The workflow represents data-wrangling steps.
 */
export interface DataBundleSchema extends ResourceSchema {
	/**
	 * Resource path to the datatable file, which contains the data source and parsing options.
	 */
	datatable?: string | DataTableSchema

	/**
	 * Resource path to the codebook file, which contains the interpretation options and data-type mappings.
	 */
	codebook?: string | CodebookSchema

	/**
	 * Resource path to the workflow file, which contains the data-wrangling steps.
	 */
	workflow?: string | WorkflowSchema
}
