/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AppProfileInitializationContext,
	AppProfile,
	ProfileFieldWell,
} from '@datashaper/app-framework'
import { CommandBarSection, ResourceGroupType } from '@datashaper/app-framework'
import type { ResourceSchema } from '@datashaper/schema'
import { KnownRel } from '@datashaper/schema'
import type { DataPackage } from '@datashaper/workflow'
import { ResourceReference, dereference } from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'

import { TEST_APP_PROFILE } from './constants.js'
import { TestApp } from './TestApp.js'
import { TestAppResource } from './TestAppResource.js'

export class TestAppProfile implements AppProfile<TestAppResource> {
	public readonly profile = TEST_APP_PROFILE
	public readonly title = 'Test App'
	public readonly iconName = 'TestBeaker'
	public readonly renderer = TestApp
	public readonly group = ResourceGroupType.Apps
	private _dataPackage: DataPackage | undefined

	public initialize({ dataPackage }: AppProfileInitializationContext): void {
		this._dataPackage = dataPackage
	}

	public createInstance(
		schema?: ResourceSchema | undefined,
	): Promise<TestAppResource> {
		const result = new TestAppResource()
		if (schema != null) {
			result.loadSchema(schema)
		}
		return Promise.resolve(result)
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
						this.createInstance().then((resource) => {
							resource.name = dp.suggestResourceName(resource.name)
							dp.addResource(resource)
						})
					},
				},
			]
		}
	}

	public getFieldWells(resource: TestAppResource): ProfileFieldWell[] {
		const resources = this._dataPackage?.resources
		return [
			{
				key: 'input-table',
				title: 'Input table',
				icon: 'Table',
				placeholder: 'Select input table',
				options: resources
					?.filter((r) => r.profile === 'tablebundle')
					.map((r) => ({
						key: r.name,
						text: r.title || r.name,
					})),
				onChange: (key: string) => {
					// TODO: this is going to be a common pattern, extract a helper
					// create a new symlink if it doesn't already exist in the local sources
					// and swap it in/out with this key, and remove the old one if changed
					const dereferenced = resource.sources.map(dereference)
					const existing = dereferenced.find((r) => r?.name === key)
					if (!existing) {
						const sibling = resources?.find((r) => r.name === key)
						if (sibling) {
							// remove the previous input
							const filteredSources = dereferenced
								.filter((s) => s?.name !== resource.input)
								.filter((s) => s !== undefined) as ResourceReference[]
							// create a new symlink to replace it
							const reference = new ResourceReference()
							reference.target = sibling
							reference.rel = KnownRel.Input
							resource.sources = [...filteredSources, reference]
							// save the input for next time
							resource.input = key
						} else {
							console.warn('no eligible sibling resource found to add', key)
						}
					}
				},
			},
		]
	}
}
