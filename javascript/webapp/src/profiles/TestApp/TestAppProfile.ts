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
import type { SettingsConfig, SettingConfig } from '@essex/components'
import type { IContextualMenuItem, IDropdownOption } from '@fluentui/react'
import { DropdownMenuItemType } from '@fluentui/react'

import { TEST_APP_PROFILE } from './constants.js'
import { TestApp } from './TestApp.js'
import type { TestAppConfig } from './TestAppResource.js'
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
		const defaultSettings = getDefaultSettings(this.getSettingsConfig())
		const result = new TestAppResource(defaultSettings)
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
		const siblings = this._dataPackage?.resources

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
				disabled: options.length === 2, // if there's only 2 options, it's just the headers
				options,
				onChange: (key: string) => {
					clearInput(resource)
					linkInput(resource, siblings, key)
					resource.input = key
				},
				onReset: () => {
					// unwind the onChange logic
					clearInput(resource)
					resource.input = undefined
				},
			},
		]
	}

	public getSettingsConfig(): SettingsConfig {
		return {
			title: {
				defaultValue: 'Tester',
			},
			version: {
				defaultValue: 1,
			},
			language: {
				defaultValue: 'JavaScript',
				params: {
					options: ['JavaScript', 'TypeScript', 'Python', 'Rust'],
				},
			},
			metrics: {
				defaultValue: ['accuracy'],
				params: {
					options: ['accuracy', 'precision', 'recall', 'f1'],
				},
			},
		}
	}
}

// iterate through the settings config and construct
// a basic object using the default values
function getDefaultSettings(config: SettingsConfig): TestAppConfig {
	return (
		Object.entries(config) as Array<[keyof TestAppConfig, SettingConfig]>
	).reduce((acc, cur) => {
		const [key, conf] = cur
		acc[key] = conf.defaultValue
		return acc
	}, {} as any) as TestAppConfig // `any` here works around an issue with the empty initial object since all properties on TestAppConfig are required
}

// if the source is a sibling, create a symlink
// otherwise, it should already be a child
function linkInput(
	resource: TestAppResource,
	siblings: Resource[] | undefined,
	key: string,
) {
	const sibling = siblings?.find((r) => r?.name === key)
	if (sibling) {
		const reference = new ResourceReference()
		reference.target = sibling
		reference.rel = KnownRel.Input
		resource.sources = [...resource.sources, reference]
	}
}

// remove the previous input if relevant
// note: only actually remove it from the sources if it is a symlink
// if it is a child, it should only be unlinked as input, not removed
function clearInput(resource: TestAppResource) {
	if (resource.input) {
		resource.sources = resource.sources.filter((r) => {
			if (!isReference(r)) {
				return true
			}
			return r?.target?.name !== resource.input
		})
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
	const siblings = (resources || [])
		.filter(predicate)
		.map((r) => resourceOption(r))
	// list out all children that are not already links to roots
	const children = sources
		.filter((r) => !isReference(r))
		.filter(predicate)
		.map((r) => resourceOption(r))
	return [
		{
			key: '__siblings__',
			text: 'Package tables',
			itemType: DropdownMenuItemType.Header,
		},
		...siblings,
		{
			key: '__children__',
			text: 'Child tables',
			itemType: DropdownMenuItemType.Header,
		},
		...children,
	]
}

function resourceOption(resource: Resource): IDropdownOption {
	return {
		key: resource.name,
		text: resource.title || resource.name,
	}
}
