/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { AppProfile } from '../types.js'
import { CodebookAppProfile } from './CodebookAppProfile.js'
import { DataTableAppProfile } from './DataTableAppProfile.js'
import { TableBundleAppProfile } from './TableBundleAppProfile.js'
import { WorkflowAppProfile } from './WorkflowAppProfile.js'

export * from './CodebookAppProfile.js'
export * from './DataTableAppProfile.js'
export * from './TableBundleAppProfile.js'
export * from './WorkflowAppProfile.js'

export function defaultAppProfiles(): AppProfile<any, any>[] {
	const datatable = new DataTableAppProfile()
	const codebook = new CodebookAppProfile()
	const workflow = new WorkflowAppProfile()
	const tableBundle = new TableBundleAppProfile(datatable, codebook, workflow)
	return [datatable, codebook, workflow, tableBundle]
}
