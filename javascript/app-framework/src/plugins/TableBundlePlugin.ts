/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { KnownProfile } from '@datashaper/schema'
import type {
	DataPackage} from '@datashaper/workflow';
import {
	type Codebook,
	type DataTable,
	type Workflow,
	TableBundle,
} from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'

import { BundleEditor } from '../components/editors/index.js'
import type { AppServices, ProfilePlugin } from '../types.js';
import { CommandBarSection , ResourceGroup } from '../types.js'

export class TableBundlePlugin implements ProfilePlugin<TableBundle> {
	public readonly profile = KnownProfile.TableBundle
	public readonly title = 'Table'
	public readonly renderer = BundleEditor
	public readonly iconName = 'ViewAll'
	public readonly group = ResourceGroup.Data

	private _dataPackage: DataPackage | undefined

	public constructor(
		private readonly datatablePlugin: ProfilePlugin<DataTable>,
		private readonly codebookPlugin: ProfilePlugin<Codebook>,
		private readonly workflowPlugin: ProfilePlugin<Workflow>,
	) {}

	public initialize(_api: AppServices, dp: DataPackage): void {
		this._dataPackage = dp
	}

	public createResource(): TableBundle {
		const result = new TableBundle()
		result.name = 'New Table'
		return result
	}

	public getCommandBarCommands(section: CommandBarSection) {
		const dp = this._dataPackage
		if (dp == null) {
			throw new Error('Data package not initialized')
		}
		if (section === CommandBarSection.New) {
			return [
				{
					key: this.profile,
					text: `New ${this.title}`,
					onClick: () => {
						const resource = this.createResource?.()
						resource.name = dp.suggestResourceName(resource.name)
						dp.addResource(resource)
					},
				},
			]
		}
	}

	public getMenuItems(resource: TableBundle): IContextualMenuItem[] {
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
