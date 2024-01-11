/*
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFieldBinding as DataFieldBindingSchema } from '@datashaper/schema'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import { Observed } from './Observed.js'

export class DataFieldBinding extends Observed implements DataFieldBindingSchema {
	private _field = new BehaviorSubject<string | undefined>(undefined)

	public constructor(schema?: DataFieldBindingSchema) {
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

	public toSchema(): DataFieldBindingSchema {
		return {
			field: this._field.value,
		}
	}

	public loadSchema(
		schema: Maybe<DataFieldBindingSchema>,
		quiet?: boolean,
	): void {
		this._field.next(schema?.field)

		if (!quiet) {
			this._onChange.next()
		}
	}
}
