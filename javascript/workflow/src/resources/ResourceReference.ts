/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Resource } from './Resource.js'

export class ResourceReference extends Resource {
	private _target: Resource | undefined
	public profile = undefined
	public $schema = undefined

	public constructor() {
		super()
	}

	public isReference() {
		return true
	}

	public get target(): Resource | undefined {
		return this._target
	}

	public set target(value: Resource | undefined) {
		this._target = value
		this._onChange.next()
	}

	public override defaultTitle(): string {
		return this._target?.defaultTitle() ?? 'reference'
	}
}
