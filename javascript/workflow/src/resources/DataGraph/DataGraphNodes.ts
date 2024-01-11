/*
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataGraphNodes as DataGraphNodesSchema } from '@datashaper/schema'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../../primitives.js'
import { Observed } from '../Observed.js'
import { CartesianPointBindings } from './CartesianPointBindings.js'

export class DataGraphNodes extends Observed implements DataGraphNodesSchema {
	private _input$ = new BehaviorSubject<string | undefined>(undefined)
	private _identifier$ = new BehaviorSubject<string | undefined>(undefined)

	public bindings = new CartesianPointBindings()

	public constructor(schema?: DataGraphNodesSchema) {
		super()
		this.loadSchema(schema)
	}

	public get input$(): Observable<string | undefined> {
		return this._input$
	}

	public get input(): string | undefined {
		return this._input$.value
	}

	public set input(input: string | undefined) {
		this._input$.next(input)
		this._onChange.next()
	}

	public get identifier$(): Observable<string | undefined> {
		return this._identifier$
	}

	public get identifier(): string | undefined {
		return this._identifier$.value
	}

	public set identifier(identifier: string | undefined) {
		this._identifier$.next(identifier)
		this._onChange.next()
	}

	public toSchema(): DataGraphNodesSchema {
		return {
			input: this._input$.value,
			identifier: this._identifier$.value,
			bindings: this.bindings.toSchema(),
		}
	}

	public loadSchema(
		schema: Maybe<DataGraphNodesSchema>,
		quiet?: boolean,
	): void {
		this._input$.next(schema?.input)
		this._identifier$.next(schema?.identifier)
		this.bindings.loadSchema(schema?.bindings, true)
		if (!quiet) {
			this._onChange.next()
		}
	}
}
