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

import type { DataTable } from './DataTable.js'
import type { Resource } from './Resource.js'
import type { TableBundle } from './TableBundle.js'

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
