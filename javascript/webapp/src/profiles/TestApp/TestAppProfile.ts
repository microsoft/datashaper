/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AppProfileInitializationContext,
	AppProfile,
	ResourceSlot,
} from '@datashaper/app-framework'
import { CommandBarSection, ResourceGroupType } from '@datashaper/app-framework'
import type { ResourceSchema } from '@datashaper/schema'
import type { DataPackage } from '@datashaper/workflow'
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

	public getSlots() {
		return [
			{
				key: 'input-table',
				profile: 'tablebundle',
				title: 'Input table',
				icon: 'Table',
				placeholder: 'Select input table',
			},
		] as ResourceSlot[]
	}
}
