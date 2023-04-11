/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Configurable, ResourceConfig } from '@datashaper/workflow'
import { Resource } from '@datashaper/workflow'
import { TEST_APP_PROFILE } from './constants.js'

export class TestAppResource
	extends Resource
	implements Configurable<TestAppConfig>
{
	public readonly $schema = ''
	public readonly profile = TEST_APP_PROFILE
	private _count = 0
	private _input: string | undefined
	private _config: TestAppConfig = { title: 'Tester', version: 1 }

	public override defaultName(): string {
		return 'Test App'
	}

	public get count(): number {
		return this._count
	}

	public set count(value: number) {
		this._count = value
		this._onChange.next()
	}

	public set input(value: string | undefined) {
		this._input = value
		this._onChange.next()
	}

	public get input(): string | undefined {
		return this._input
	}

	public get config(): TestAppConfig {
		return this._config
	}

	public set config(value: TestAppConfig) {
		this._config = value
		this._onChange.next()
	}

	public override toSchema(): any {
		return {
			...super.toSchema(),
			count: this.count,
			input: this.input,
			config: this.config,
		}
	}

	public override loadSchema(schema: any): void {
		super.loadSchema(schema)
		this.count = schema.count ?? 0
		this.config = schema.config
	}
}

export interface TestAppConfig extends ResourceConfig {
	title: string
	version: number
}
