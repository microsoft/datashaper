/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import type { Observable } from 'rxjs'
import { BehaviorSubject, map } from 'rxjs'

import { Observed } from './Observed.js'
import type { SchemaResource } from './types.js'

export class ResourceStore extends Observed {
	public _resources = new BehaviorSubject<SchemaResource[]>([])

	public get resources(): SchemaResource[] {
		return this._resources.value
	}

	public get resources$(): Observable<SchemaResource[]> {
		return this._resources
	}

	public get size(): number {
		return this.resources.length
	}

	public get size$(): Observable<number> {
		return this._resources.pipe(map(r => r.length))
	}

	public get names(): string[] {
		return this.resources.map(r => r.name).filter(t => !!t) as string[]
	}

	public get names$(): Observable<string[]> {
		return this._resources.pipe(map(r => r.map(t => t.name)))
	}

	public add(resource: SchemaResource): void {
		this._resources.next([
			// TODO: filter by id or name to guarantee uniqueness?
			...this.resources,
			resource,
		])
		this._onChange.next()
	}

	public remove(name: string): void {
		this._resources.next(this.resources.filter(t => name !== t.name))
		this._onChange.next()
	}

	public get(name: string): SchemaResource | undefined {
		return this.resources.find(t => t.name === name)
	}

	public clear(): void {
		this._resources.next([])
		this._onChange.next()
	}
}
