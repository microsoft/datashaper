/*
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataGraphEdges as DataGraphEdgesSchema } from '@datashaper/schema'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../../primitives.js'
import { Observed } from '../Observed.js'
import { CartesianLineBindings } from './CartesianLineBindings.js'

export class DataGraphEdges extends Observed implements DataGraphEdgesSchema {
	private _input$ = new BehaviorSubject<string | undefined>(undefined)
	private _identifier$ = new BehaviorSubject<string | undefined>(undefined)
	private _source$ = new BehaviorSubject<string | undefined>(undefined)
	private _target$ = new BehaviorSubject<string | undefined>(undefined)

	public bindings = new CartesianLineBindings()

	public constructor(schema?: DataGraphEdgesSchema) {
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

	public get source$(): Observable<string | undefined> {
		return this._source$
	}

	public get source(): string | undefined {
		return this._source$.value
	}

	public set source(source: string | undefined) {
		this._source$.next(source)
		this._onChange.next()
	}

	public get target$(): Observable<string | undefined> {
		return this._target$
	}

	public get target(): string | undefined {
		return this._target$.value
	}

	public set target(target: string | undefined) {
		this._target$.next(target)
		this._onChange.next()
	}

	public toSchema(): DataGraphEdgesSchema {
		return {
			input: this._input$.value,
			identifier: this._identifier$.value,
			source: this._source$.value,
			target: this._target$.value,
			bindings: this.bindings.toSchema(),
		}
	}

	public loadSchema(
		schema: Maybe<DataGraphEdgesSchema>,
		quiet?: boolean,
	): void {
		this._input$.next(schema?.input)
		this._identifier$.next(schema?.identifier)
		this._source$.next(schema?.source)
		this._target$.next(schema?.target)
		this.bindings.loadSchema(schema?.bindings, true)
		if (!quiet) {
			this._onChange.next()
		}
	}
}
