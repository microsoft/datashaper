/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { KnownProfile } from '@datashaper/schema'
import {
	type Codebook,
	type DataTable,
	type Workflow,
	TableBundle,
} from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'

import { BundleEditor } from '../components/editors/index.js'
import type { ProfilePlugin } from '../types.js'
import { ResourceGroup } from '../types.js'

export class TableBundlePlugin implements ProfilePlugin<TableBundle> {
	public readonly profile = KnownProfile.TableBundle
	public readonly title = 'Table'
	public readonly renderer = BundleEditor
	public readonly iconName = 'ViewAll'
	public readonly group = ResourceGroup.Data
	public readonly isTopLevel = true

	public constructor(
		private readonly datatablePlugin: ProfilePlugin<DataTable>,
		private readonly codebookPlugin: ProfilePlugin<Codebook>,
		private readonly workflowPlugin: ProfilePlugin<Workflow>,
	) {}

	public createResource(): TableBundle {
		const result = new TableBundle()
		result.name = 'New Table'
		return result
	}

	public onGetMenuItems(resource: TableBundle): IContextualMenuItem[] {
		const result: IContextualMenuItem[] = [
			// {
			// 	key: 'new-derived-table',
			// 	text: 'New Derived Table',
			// 	onClick: () => {},
			// },
			// {
			// 	key: 'add-symlink',
			// 	text: 'Add Table Link',
			// 	onClick: () => {},
			// },
		]
		if (resource.input == null) {
			result.push({
				key: 'add-datatable',
				text: 'Add Datatable',
				iconProps: { iconName: this.datatablePlugin.iconName },
				onClick: () => {
					resource.input = this.datatablePlugin.createResource?.()
				},
			})
		}
		if (resource.workflow == null) {
			result.push({
				key: 'add-workflow',
				text: 'Add Workflow',
				iconProps: { iconName: this.workflowPlugin.iconName },
				onClick: () => {
					resource.workflow = this.workflowPlugin.createResource?.()
				},
			})
		}
		if (resource.codebook == null) {
			result.push({
				key: 'add-codebook',
				text: 'Add Codebook',
				iconProps: { iconName: this.codebookPlugin.iconName },
				onClick: () => {
					resource.codebook = this.codebookPlugin.createResource?.()
				},
			})
		}
		return result
	}
}
