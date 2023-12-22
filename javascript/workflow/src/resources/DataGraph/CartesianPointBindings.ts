/*
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CartesianPointBindings as CartesianPointBindingsSchema } from '@datashaper/schema'

import type { Maybe } from '../../primitives.js'
import { Observed } from '../Observed.js'
import { DataFieldBinding } from '../DataFieldBinding.js'
import { NumericFieldScaleBinding } from '../NumericFieldScaleBinding.js'
import { ColorBinding } from '../ColorBinding.js'

export class CartesianPointBindings
	extends Observed
	implements CartesianPointBindingsSchema
{
	public x = new DataFieldBinding()
	public y = new DataFieldBinding()
	public size = new NumericFieldScaleBinding()
	public fill = new ColorBinding()

	public constructor(schema?: CartesianPointBindingsSchema) {
		super()
		this.loadSchema(schema)
	}

	public toSchema(): CartesianPointBindingsSchema {
		return {
			x: this.x.toSchema(),
			y: this.y.toSchema(),
			size: this.size.toSchema(),
			fill: this.fill.toSchema()
		}
	}

	public loadSchema(
		schema: Maybe<CartesianPointBindingsSchema>,
		quiet?: boolean,
	): void {
		this.x.loadSchema(schema?.x, true)
		this.y.loadSchema(schema?.y, true)
		this.size.loadSchema(schema?.size, true)
		this.fill.loadSchema(schema?.fill, true)
		if (quiet) {
			this._onChange.next()
		}
	}
}
