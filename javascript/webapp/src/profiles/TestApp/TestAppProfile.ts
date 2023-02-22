/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AppProfileInitializationContext,
	AppProfile,
} from '@datashaper/app-framework'
import { CommandBarSection, ResourceGroupType } from '@datashaper/app-framework'
import type { FieldWellItem } from '@datashaper/react'
import type { ResourceSchema } from '@datashaper/schema'
import { KnownProfile, KnownRel } from '@datashaper/schema'
import type { DataPackage, Resource } from '@datashaper/workflow'
import { ResourceReference, isReference } from '@datashaper/workflow'
import type { IContextualMenuItem, IDropdownOption } from '@fluentui/react'

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

	public getFieldWells(resource: TestAppResource): FieldWellItem[] {
		// list out all root siblings as base options
		const resources = this._dataPackage?.resources

		// filter this full list to only include tables and not include the current resource
		const options = createSourceFieldOptions(
			this._dataPackage?.resources,
			resource.sources,
			(r) => r.profile === KnownProfile.TableBundle && r.name !== resource.name,
		)
		return [
			{
				key: 'input-table',
				title: 'Input table',
				icon: 'Table',
				placeholder: 'Select input table',
				selectedKey: resource.input,
				options,
				onChange: (key: string) => {
					// TODO: this is going to be a common pattern, extract a helper

					// remove the previous input if relevant
					// note: only actually remove it from the sources if it is a symlink
					// if it is a child, it should only be unlinked as input, not removed
					if (resource.input) {
						resource.sources = resource.sources.filter((r) => {
							if (!isReference(r)) {
								return true
							}
							return r?.target?.name !== resource.input
						})
					}
					// if the source is a sibling, create a symlink
					// otherwise, it should already be a child
					const sibling = resources?.find((r) => r?.name === key)
					if (sibling) {
						const reference = new ResourceReference()
						reference.target = sibling
						reference.rel = KnownRel.Input
						resource.sources = [...resource.sources, reference]
					}

					resource.input = key
				},
			},
		]
	}
}

/**
 * Makes a set of valid options to select from for a field well dropdown.
 * This combines all siblings (if provided), all children (if provided),
 * and a predicate to add additional filtering logic.
 * @param resources - the sibling resources in the data package
 * @param sources - child resources of the resource containing the well
 */
function createSourceFieldOptions(
	resources: Resource[] | undefined,
	sources: (Resource | ResourceReference)[],
	predicate: (r: Resource | ResourceReference) => boolean,
): IDropdownOption[] {
	// list out all children that are not already links to roots
	const children = sources.filter((r) => !isReference(r))
	// combine all resources and filter with the provided predicte
	const possible = [...(resources || []), ...children].filter(
		predicate,
	) as ResourceReference[]
	return possible.map((r) => ({
		key: r.name,
		text: r.title || r.name,
	}))
}
