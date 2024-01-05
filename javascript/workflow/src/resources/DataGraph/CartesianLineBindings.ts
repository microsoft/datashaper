/*
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CartesianLineBindings as CartesianLineBindingsSchema } from '@datashaper/schema'

import type { Maybe } from '../../primitives.js'
import { Observed } from '../Observed.js'
import { NumericFieldScaleBinding } from '../NumericFieldScaleBinding.js'
import { BehaviorSubject, Observable } from 'rxjs'

export class CartesianLineBindings
	extends Observed
	implements CartesianLineBindingsSchema
{
	public width = new NumericFieldScaleBinding()
	private _stroke = new BehaviorSubject<string | undefined>(undefined)

	public constructor(schema?: CartesianLineBindingsSchema) {
		super()
		this.loadSchema(schema)
	}

	public get stroke$(): Observable<string | undefined> {
		return this._stroke
	}

	public get stroke(): string | undefined {
		return this._stroke.value
	}

	public set stroke(stroke: string | undefined) {
		this._stroke.next(stroke)
		this._onChange.next()
	}

	public toSchema(): CartesianLineBindingsSchema {
		return {
			width: this.width.toSchema(),
			stroke: this._stroke.value,
		}
	}

	public loadSchema(
		schema: Maybe<CartesianLineBindingsSchema>,
		quiet?: boolean,
	): void {
		this.width.loadSchema(schema?.width, true)
		this._stroke.next(schema?.stroke)
		if (quiet) {
			this._onChange.next()
		}
	}
}
