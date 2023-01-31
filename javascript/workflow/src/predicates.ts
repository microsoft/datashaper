/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	DataTableSchema,
	ResourceSchema,
	WorkflowSchema,
} from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'

import type { DataTable } from './resources/DataTable.js'
import type { Resource } from './resources/Resource.js'
import type { ResourceReference } from './resources/ResourceReference.js'
import type { TableBundle } from './resources/TableBundle.js'
import type { TableEmitter, TableTransformer } from './resources/types/index.js'

export const isWorkflowSchema = (
	r: ResourceSchema | undefined,
): r is WorkflowSchema =>
	r == null
		? false
		: r.profile === KnownProfile.Workflow ||
		  (r.$schema?.indexOf('/workflow/') ?? -1) > -1

export const isWorkflow = (r: Resource | undefined): boolean =>
	r == null ? false : r.profile === KnownProfile.Workflow

export const isCodebookSchema = (
	r: ResourceSchema | undefined,
): r is CodebookSchema =>
	r == null
		? false
		: r.profile === KnownProfile.Codebook ||
		  (r.$schema?.indexOf('/codebook/') ?? -1) > -1

export const isCodebook = (r: Resource | undefined): boolean =>
	r == null ? false : r.profile === KnownProfile.Codebook

export const isTableBundleSchema = (
	r: ResourceSchema | undefined,
): r is ResourceSchema =>
	r == null ? false : r.profile === KnownProfile.TableBundle

export const isTableBundle = (r: Resource | undefined): r is TableBundle =>
	r == null ? false : r.profile === KnownProfile.TableBundle

export const isDataTableSchema = (
	r: ResourceSchema | undefined,
): r is DataTableSchema =>
	r == null
		? false
		: r.profile === KnownProfile.DataTable ||
		  (r.$schema?.indexOf('/datatable/') ?? -1) > -1

export const isDataTable = (r: Resource | undefined): r is DataTable =>
	r == null ? false : r.profile === KnownProfile.DataTable

export const isReference = (r: Resource | undefined): r is ResourceReference =>
	(r as ResourceReference)?.isReference?.() ?? false

export const dereference = (
	r: Resource | ResourceReference,
): Resource | undefined => (isReference(r) ? r.target : r)

export const isTableEmitter = (r: Resource | undefined): r is TableEmitter => {
	return (
		r?.profile === KnownProfile.TableBundle ||
		r?.profile === KnownProfile.DataTable
	)
}

export const isTableTransformer = (
	r: Resource | undefined,
): r is TableTransformer => {
	return (
		r?.profile === KnownProfile.Workflow || r?.profile === KnownProfile.Codebook
	)
}

export function isReferenceSchema(
	entry: ResourceSchema | string,
): entry is ResourceSchema & { path: string } {
	return (
		typeof entry !== 'string' &&
		entry.profile == null &&
		entry.path != null &&
		typeof entry.path === 'string'
	)
}
