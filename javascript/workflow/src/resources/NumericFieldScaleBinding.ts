/*
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NumericFieldScaleBinding as NumericFieldBindingSchema } from '@datashaper/schema'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import { Observed } from './Observed.js'

// TODO: find a better place for defaults
// TODO: auto-compute domain from table if unset
const DOMAIN_DEFAULT: [number, number] = [0, 1]
const RANGE_DEFAULT: [number, number] = [1, 10]

export class NumericFieldScaleBinding
	extends Observed
	implements NumericFieldBindingSchema
{
	private _field = new BehaviorSubject<string | undefined>(undefined)
	private _domain = new BehaviorSubject<[number, number]>(DOMAIN_DEFAULT)
	private _range = new BehaviorSubject<[number, number]>(RANGE_DEFAULT)

	public constructor(schema?: NumericFieldBindingSchema) {
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

	public get domain$(): Observable<[number, number]> {
		return this._domain
	}

	public get domain(): [number, number] {
		return this._domain.value
	}

	public set domain(domain: [number, number]) {
		this._domain.next(domain)
		this._onChange.next()
	}

	public get range$(): Observable<[number, number]> {
		return this._range
	}

	public get range(): [number, number] {
		return this._range.value
	}

	public set range(range: [number, number]) {
		this._range.next(range)
		this._onChange.next()
	}

	public toSchema(): NumericFieldBindingSchema {
		return {
			field: this._field.value,
			domain: this._domain.value,
			range: this._range.value,
		}
	}

	public loadSchema(
		schema: Maybe<NumericFieldBindingSchema>,
		quiet?: boolean,
	): void {
		this._field.next(schema?.field)
		this._domain.next(schema?.domain || DOMAIN_DEFAULT)
		this._range.next(schema?.range || RANGE_DEFAULT)

		if (!quiet) {
			this._onChange.next()
		}
	}
}
