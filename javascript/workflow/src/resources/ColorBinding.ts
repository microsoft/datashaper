/*
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColorBinding as ColorBindingSchema } from '@datashaper/schema'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import { Observed } from './Observed.js'

export class ColorBinding
	extends Observed
	implements ColorBindingSchema
{
	private _field = new BehaviorSubject<string | undefined>(undefined)
	private _scale = new BehaviorSubject<string | undefined>('nominal')
	
	public constructor(schema?: ColorBindingSchema) {
		super()
		this.loadSchema(schema)
	}

	public get field$(): Observable<string | undefined> {
		return this._field
	}

	public get field(): string | undefined {
		return this._field.value
	}

	public set field(field: string | undefined) {
		this._field.next(field)
		this._onChange.next()
	}


	public get scale$(): Observable<string | undefined> {
		return this._scale
	}

	public get scale(): string | undefined {
		return this._scale.value
	}

	public set scale(scale: string | undefined) {
		this._scale.next(scale)
		this._onChange.next()
	}


	public toSchema(): ColorBindingSchema {
		return {
			field: this._field.value,
			scale: this._scale.value,
		}
	}

	public loadSchema(
		schema: Maybe<ColorBindingSchema>,
		quiet?: boolean,
	): void {
		this._field.next(schema?.field)
		this._scale.next(schema?.scale || 'nominal')

		if (quiet) {
			this._onChange.next()
		}
	}
}
