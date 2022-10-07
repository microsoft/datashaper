/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataNature, DataOrientation } from '@datashaper/schema'
import type { DataShape as DataShapeSchema } from '@datashaper/schema/dist/datatable/DataShape.js'

import { Observed } from './Observed.js'
import type { SchemaResource } from './types.js'

export class DataShape
	extends Observed
	implements DataShapeSchema, SchemaResource<DataShapeSchema>
{
	private _orientation: DataOrientation | undefined
	private _nature: DataNature | undefined
	private _matrix: [width: number, height: number] | undefined

	public constructor(shape?: DataShapeSchema) {
		super()
		this.loadSchema(shape)
	}

	public get orientation(): DataOrientation | undefined {
		return this._orientation
	}

	public set orientation(value: DataOrientation | undefined) {
		this._orientation = value
		this._onChange.next()
	}

	public get nature(): DataNature | undefined {
		return this._nature
	}

	public set nature(value: DataNature | undefined) {
		this._nature = value
		this._onChange.next()
	}

	public get matrix(): [width: number, height: number] | undefined {
		return this._matrix
	}

	public set matrix(value: [width: number, height: number] | undefined) {
		this._matrix = value
		this._onChange.next()
	}

	public toSchema(): DataShapeSchema {
		return {
			matrix: this.matrix,
			nature: this.nature,
			orientation: this.orientation,
		}
	}

	public loadSchema(
		schema: DataShapeSchema | null | undefined,
		quiet?: boolean,
	): void {
		this._matrix = schema?.matrix
		this._nature = schema?.nature
		this._orientation = schema?.orientation
		if (!quiet) {
			this._onChange.next()
		}
	}
}
