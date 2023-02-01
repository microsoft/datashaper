/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import content from '@datashaper/guidance'
import {
	type TableBundleSchema,
	KnownProfile,
	KnownRel,
} from '@datashaper/schema'
import {
	type Codebook,
	type DataPackage,
	type DataTable,
	type TableBundle,
	type Workflow,
	ResourceReference,
	TableBundleProfile,
} from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'

import type { AppProfileInitializationContext, AppProfile } from '../types.js'
import { CommandBarSection, ResourceGroupType } from '../types.js'
import { TableBundleRenderer } from './renderers/TableBundleRenderer.js'

export class TableBundleAppProfile
	extends TableBundleProfile
	implements AppProfile<TableBundle, TableBundleSchema>
{
	public readonly title = 'Table'
	public readonly renderer = TableBundleRenderer
	public readonly iconName = 'ViewAll'
	public readonly group = ResourceGroupType.Data

	private _dataPackage: DataPackage | undefined

	public constructor(
		private readonly datatableProfile: AppProfile<DataTable>,
		private readonly codebookProfile: AppProfile<Codebook>,
		private readonly workflowProfile: AppProfile<Workflow>,
	) {
		super()
	}

	public initialize({
		dataPackage: dp,
	}: AppProfileInitializationContext): void {
		this._dataPackage = dp
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
					onClick: () =>
						void this.createInstance().then((res) => dp.addResource(res)),
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
					void this.createInstance().then((derived) => {
						derived.title = resource.title

						// Create a reference to the source resource
						const reference = new ResourceReference()
						reference.target = resource
						reference.rel = KnownRel.Input

						derived.sources = [reference]
						dp.addResource(derived)
					})
				},
			},
		]
		if (resource.input == null) {
			result.push({
				key: 'add-datatable',
				text: 'Add Datatable',
				iconProps: { iconName: this.datatableProfile.iconName },
				onClick: () => {
					this.datatableProfile.createInstance?.().then((instance) => {
						resource.sources = [instance, ...resource.sources]
					})
				},
			})
		}
		if (!resource.sources.some((r) => r.profile === KnownProfile.Workflow)) {
			result.push({
				key: 'add-workflow',
				text: 'Add Workflow',
				iconProps: { iconName: this.workflowProfile.iconName },
				onClick: () => {
					this.workflowProfile.createInstance?.().then((instance) => {
						resource.sources = [...resource.sources, instance]
					})
				},
			})
		}
		if (!resource.sources.some((r) => r.profile === KnownProfile.Codebook)) {
			result.push({
				key: 'add-codebook',
				text: 'Add Codebook',
				iconProps: { iconName: this.codebookProfile.iconName },
				onClick: () => {
					this.codebookProfile.createInstance?.().then((codebook) => {
						resource.sources = [...resource.sources, codebook]
					})
				},
			})
		}
		return result
	}

	public getHelp(): Record<string, string> {
		return content
	}
}
