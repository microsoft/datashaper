/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { KnownProfile, KnownRel } from '@datashaper/schema'
import {
	type Codebook,
	type DataPackage,
	type DataTable,
	type Workflow,
	ResourceReference,
	TableBundle,
} from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'

import { TableBundleEditor } from '../components/editors/index.js'
import type { AppServices, ProfilePlugin } from '../types.js'
import { CommandBarSection, ResourceGroupType } from '../types.js'

export class TableBundleProfile implements ProfilePlugin<TableBundle> {
	public readonly profile = KnownProfile.TableBundle
	public readonly title = 'Table'
	public readonly renderer = TableBundleEditor
	public readonly iconName = 'ViewAll'
	public readonly group = ResourceGroupType.Data

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
		result.name = 'Data table'
		return result
	}

	public getCommandBarCommands(
		section: CommandBarSection,
	): IContextualMenuItem[] | undefined {
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
						dp.checkResourceName(resource)
						dp.addResource(resource, true)
					},
				},
			]
		}
	}

	public getMenuItems(resource: TableBundle): IContextualMenuItem[] {
		const dp = this._dataPackage
		if (!dp) {
			throw new Error('Data package not initialized')
		}
		const result: IContextualMenuItem[] = [
			{
				key: 'new-derived-table',
				text: 'New Derived Table',
				iconProps: { iconName: this.iconName },
				onClick: () => {
					const derived = this.createResource()
					dp.checkResourceName(derived)
					derived.title = resource.title

					// Create a reference to the source resource
					const reference = new ResourceReference()
					reference.target = resource
					reference.rel = KnownRel.Input

					derived.sources = [reference]
					dp.addResource(derived, true)
				},
			},
		]
		if (resource.input == null) {
			result.push({
				key: 'add-datatable',
				text: 'Add Datatable',
				iconProps: { iconName: this.datatablePlugin.iconName },
				onClick: () => {
					resource.sources = [
						this.datatablePlugin.createResource?.(),
						...resource.sources,
					]
				},
			})
		}
		if (!resource.sources.some(r => r.profile === KnownProfile.Workflow)) {
			result.push({
				key: 'add-workflow',
				text: 'Add Workflow',
				iconProps: { iconName: this.workflowPlugin.iconName },
				onClick: () => {
					resource.sources = [
						...resource.sources,
						this.workflowPlugin.createResource?.(),
					]
				},
			})
		}
		if (!resource.sources.some(r => r.profile === KnownProfile.Codebook)) {
			result.push({
				key: 'add-codebook',
				text: 'Add Codebook',
				iconProps: { iconName: this.codebookPlugin.iconName },
				onClick: () => {
					const codebook = this.codebookPlugin.createResource?.()
					resource.sources = [...resource.sources, codebook]
				},
			})
		}
		return result
	}
}
