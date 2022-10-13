/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import { Observed } from './Observed.js'
import type { Persistable } from './types.js'

export class PersistableStore extends Observed {
	private _persistables: Map<string, Persistable> = new Map()

	public add(persistable: Persistable): void {
		const { name } = persistable
		this._persistables.set(name, persistable)
		this._onChange.next()
	}

	public remove(name: string): void {
		this._persistables.delete(name)
		this._onChange.next()
	}

	public get(name: string): Persistable | undefined {
		return this._persistables.get(name)
	}

	public get size(): number {
		return this._persistables.size
	}

	public get names(): string[] {
		return [...this._persistables.keys()]
	}

	public clear(): void {
		this._persistables.clear()
		this._onChange.next()
	}

	public get persistables(): Map<string, Persistable> {
		return this._persistables
	}
}
