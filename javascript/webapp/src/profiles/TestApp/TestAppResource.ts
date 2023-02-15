/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Resource, type Maybe } from '@datashaper/workflow'
import type { TableContainer } from '@datashaper/tables'
import { TEST_APP_PROFILE } from './constants.js'

export class TestAppResource extends Resource {
	public readonly $schema = ''
	public readonly profile = TEST_APP_PROFILE
	private _count = 0
	private _input: string | undefined

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

	public override toSchema(): any {
		return {
			...super.toSchema(),
			count: this.count,
			input: this.input,
		}
	}

	public override loadSchema(schema: any): void {
		super.loadSchema(schema)
		this.count = schema.count ?? 0
	}
}
