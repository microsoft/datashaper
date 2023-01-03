/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataNature, DataOrientation } from '@datashaper/schema'
import type { DataShape as DataShapeSchema } from '@datashaper/schema/dist/datatable/DataShape.js'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import { Observed } from './Observed.js'

export class DataShape extends Observed implements DataShapeSchema {
	private _orientation$ = new BehaviorSubject<DataOrientation | undefined>(
		undefined,
	)
	private _nature$ = new BehaviorSubject<DataNature | undefined>(undefined)
	private _matrix$ = new BehaviorSubject<
		[width: number, height: number] | undefined
	>(undefined)

	public constructor(shape?: DataShapeSchema) {
		super()
		this.loadSchema(shape)
	}

	public get orientation$(): Observable<DataOrientation | undefined> {
		return this._orientation$
	}

	public get orientation(): DataOrientation | undefined {
		return this._orientation$.value
	}

	public set orientation(value: DataOrientation | undefined) {
		this._orientation$.next(value)
		this._onChange.next()
	}

	public get nature$(): Observable<DataNature | undefined> {
		return this._nature$
	}

	public get nature(): DataNature | undefined {
		return this._nature$.value
	}

	public set nature(value: DataNature | undefined) {
		this._nature$.next(value)
		this._onChange.next()
	}

	public get matrix$(): Observable<
		[width: number, height: number] | undefined
	> {
		return this._matrix$
	}

	public get matrix(): [width: number, height: number] | undefined {
		return this._matrix$.value
	}

	public set matrix(value: [width: number, height: number] | undefined) {
		this._matrix$.next(value)
		this._onChange.next()
	}

	public toSchema(): DataShapeSchema {
		return {
			matrix: this.matrix,
			nature: this.nature,
			orientation: this.orientation,
		}
	}

	public loadSchema(schema: Maybe<DataShapeSchema>, quiet?: boolean): void {
		this._matrix$.next(schema?.matrix)
		this._nature$.next(schema?.nature)
		this._orientation$.next(schema?.orientation)
		if (!quiet) {
			this._onChange.next()
		}
	}
}
