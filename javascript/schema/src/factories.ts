/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { v4 } from 'uuid'

import { versions } from '../versions.js'
import type { CodebookSchema } from './codebook/CodebookSchema.js'
import type { DataPackageSchema } from './datapackage/DataPackageSchema.js'
import type { DataTableSchema } from './datatable/DataTableSchema.js'
import type { WorkflowSchema } from './workflow/WorkflowSchema.js'

export const LATEST_WORKFLOW_SCHEMA = `https://microsoft.github.io/datashaper/schema/workflow/v${versions.workflow}.json`
export const LATEST_DATATABLE_SCHEMA = `https://microsoft.github.io/datashaper/schema/datatable/v${versions.datatable}.json`
export const LATEST_DATAPACKAGE_SCHEMA = `https://microsoft.github.io/datashaper/schema/datapackage/v${versions.datapackage}.json`
export const LATEST_CODEBOOK_SCHEMA = `https://microsoft.github.io/datashaper/schema/codebook/v${versions.codebook}.json`

export type FactoryInput<T> = Omit<T, '$schema' | 'id' | 'name'> & {
	id?: string
	name?: string
}

export function createDataPackageSchemaObject(
	input: FactoryInput<DataPackageSchema>,
): DataPackageSchema {
	return {
		$schema: LATEST_DATATABLE_SCHEMA,
		id: input.id ?? v4(),
		name: input.name ?? 'DataPackage',
		...input,
	}
}

export function createWorkflowSchemaObject(
	input: FactoryInput<WorkflowSchema>,
): WorkflowSchema {
	return {
		$schema: LATEST_WORKFLOW_SCHEMA,
		id: input.id ?? v4(),
		name: input.name ?? 'Workflow',
		profile: 'workflow',
		...input,
	}
}

export function createDataTableSchemaObject(
	input: FactoryInput<DataTableSchema>,
): DataTableSchema {
	return {
		$schema: LATEST_DATATABLE_SCHEMA,
		id: input.id ?? v4(),
		name: input.name ?? 'DataTable',
		profile: 'datatable',
		...input,
	}
}

export function createCodebookSchemaObject(
	input: FactoryInput<CodebookSchema>,
): CodebookSchema {
	return {
		$schema: LATEST_DATATABLE_SCHEMA,
		id: input.id ?? v4(),
		name: input.name ?? 'Codebook',
		profile: 'codebook',
		...input,
	}
}
