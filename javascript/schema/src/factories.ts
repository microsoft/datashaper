/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { versions } from '../versions.js'
import type { CodebookSchema } from './codebook/CodebookSchema.js'
import type { DataGraphSchema } from './datagraph/DataGraphSchema.js'
import type { DataPackageSchema } from './datapackage/DataPackageSchema.js'
import type { DataTableSchema } from './datatable/DataTableSchema.js'
import { KnownProfile } from './enums/index.js'
import type { TableBundleSchema } from './tablebundle/TableBundleSchema.js'
import type { WorkflowSchema } from './workflow/WorkflowSchema.js'

export const LATEST_WORKFLOW_SCHEMA = `https://microsoft.github.io/datashaper/schema/workflow/v${versions.workflow}.json`
export const LATEST_DATAPACKAGE_SCHEMA = `https://microsoft.github.io/datashaper/schema/datapackage/v${versions.datapackage}.json`
export const LATEST_TABLEBUNDLE_SCHEMA = `https://microsoft.github.io/datashaper/schema/tablebundle/v${versions.tablebundle}.json`
export const LATEST_DATATABLE_SCHEMA = `https://microsoft.github.io/datashaper/schema/datatable/v${versions.datatable}.json`
export const LATEST_CODEBOOK_SCHEMA = `https://microsoft.github.io/datashaper/schema/codebook/v${versions.codebook}.json`

export type FactoryInput<T> = Omit<T, '$schema' | 'name' | 'profile'> & {
	name?: string
}

export function createDataPackageSchemaObject(
	input: FactoryInput<DataPackageSchema>,
): DataPackageSchema {
	return {
		$schema: LATEST_DATATABLE_SCHEMA,
		profile: KnownProfile.DataPackage,
		title: 'datapackage',
		name: input.name ?? 'datapackage.json',
		...input,
	}
}

export function createTableBundleSchemaObject(
	input: FactoryInput<TableBundleSchema>,
): TableBundleSchema {
	return {
		$schema: LATEST_TABLEBUNDLE_SCHEMA,
		profile: KnownProfile.TableBundle,
		title: 'table',
		name: input.name ?? 'tablebundle.json',
		...input,
	}
}

export function createWorkflowSchemaObject(
	input: FactoryInput<WorkflowSchema>,
): WorkflowSchema {
	return {
		$schema: LATEST_WORKFLOW_SCHEMA,
		title: 'workflow',
		name: input.name ?? 'workflow.json',
		profile: 'workflow',
		...input,
	}
}

export function createDataTableSchemaObject(
	input: FactoryInput<DataTableSchema>,
): DataTableSchema {
	return {
		$schema: LATEST_DATATABLE_SCHEMA,
		title: 'datatable',
		name: input.name ?? 'datatable.json',
		profile: KnownProfile.DataTable,
		...input,
	}
}

export function createCodebookSchemaObject(
	input: FactoryInput<CodebookSchema>,
): CodebookSchema {
	return {
		$schema: LATEST_DATATABLE_SCHEMA,
		title: 'codebook',
		name: input.name ?? 'codebook.json',
		profile: KnownProfile.Codebook,
		...input,
	}
}

export function createDataGraphSchemaObject(
	input: FactoryInput<DataGraphSchema>,
): DataGraphSchema {
	return {
		$schema: 'TODO: G1',
		title: 'Graph',
		name: input.name ?? 'graph.json',
		profile: KnownProfile.DataGraph,
		...input,
	}
}
