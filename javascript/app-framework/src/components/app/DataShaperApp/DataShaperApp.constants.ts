/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	CodebookPlugin,
	DataTablePlugin,
	TableBundlePlugin,
	WorkflowPlugin,
} from '../../../plugins/index.js'
import type { ProfilePlugin } from '../../../types.js'

const datatablePlugin = new DataTablePlugin()
const codebookPlugin = new CodebookPlugin()
const workflowPlugin = new WorkflowPlugin()
const tableBundlePlugin = new TableBundlePlugin(
	datatablePlugin,
	codebookPlugin,
	workflowPlugin,
)

export const KNOWN_PROFILE_PLUGINS: ProfilePlugin[] = [
	datatablePlugin,
	codebookPlugin,
	tableBundlePlugin,
	workflowPlugin,
]
