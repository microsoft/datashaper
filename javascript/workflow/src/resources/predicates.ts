/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	DataTableSchema,
	ResourceRelationship,
	ResourceSchema,
	WorkflowSchema,
} from '@datashaper/schema'

import type { DataTable } from './DataTable.js'
import type { Resource } from './Resource.js'
import type { TableBundle } from './TableBundle.js'

export const isWorkflowSchema = (
	r: ResourceSchema | undefined,
): r is WorkflowSchema =>
	r == null
		? false
		: r.profile === 'workflow' || r.$schema.indexOf('/workflow/') > -1

export const isWorkflow = (r: Resource | undefined) =>
	r == null ? false : r.profile === 'workflow'

export const isCodebookSchema = (
	r: ResourceSchema | undefined,
): r is CodebookSchema =>
	r == null
		? false
		: r.profile === 'codebook' || r.$schema.indexOf('/codebook/') > -1

export const isCodebook = (r: Resource | undefined) =>
	r == null ? false : r.profile === 'codebook'

export const isTableBundleSchema = (
	r: ResourceSchema | undefined,
): r is ResourceSchema => (r == null ? false : r.profile === 'tablebundle')

export const isTableBundle = (r: Resource | undefined): r is TableBundle =>
	r == null ? false : r.profile === 'tablebundle'

export const isDataTableSchema = (
	r: ResourceSchema | undefined,
): r is DataTableSchema =>
	r == null
		? false
		: r.profile === 'datatable' || r.$schema?.indexOf('/datatable/') > -1

export const isDataTable = (r: Resource | undefined): r is DataTable =>
	r == null ? false : r.profile === 'datatable'

export const isResourceRelationship = (
	item: string | ResourceSchema | ResourceRelationship,
): item is ResourceRelationship =>
	typeof item !== 'string' && (item as ResourceRelationship).rel != null
