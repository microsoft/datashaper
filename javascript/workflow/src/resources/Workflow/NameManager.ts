/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'
import { BehaviorSubject, map, mergeWith } from 'rxjs'

import { unique } from './utils.js'

export class NameManager {
	private readonly _inputNames$ = new BehaviorSubject<string[]>([])
	private readonly _outputNames$ = new BehaviorSubject<string[]>([])
	private readonly _allTableNames$ = this._outputNames$
		.pipe(mergeWith(this._inputNames$))
		.pipe(
			map(() =>
				unique(this._outputNames$.value.concat(this._inputNames$.value)),
			),
		)

	public get all$(): Observable<string[]> {
		return this._allTableNames$
	}

	public get inputs$(): Observable<string[]> {
		return this._inputNames$
	}

	public get inputs(): string[] {
		return this._inputNames$.value
	}

	public get outputs$(): Observable<string[]> {
		return this._outputNames$
	}

	public get outputs(): string[] {
		return this._outputNames$.value
	}

	public hasInput(name: string): boolean {
		return this.inputs.some((i) => i === name)
	}

	public hasOutput(name: string): boolean {
		return this.outputs.some((o) => o === name)
	}

	public setNames(inputs: string[], outputs: string[]): void {
		this._inputNames$.next(inputs)
		this._outputNames$.next(outputs)
	}

	public addInput(name: string): boolean {
		if (!this.hasInput(name)) {
			this._inputNames$.next([...this.inputs, name])
			return true
		}
		return false
	}

	public addOutput(name: string): boolean {
		if (!this.hasOutput(name)) {
			this._outputNames$.next([...this.outputs, name])
			return true
		}
		return false
	}

	public removeInput(name: string): boolean {
		if (this.hasInput(name)) {
			this._inputNames$.next(this.inputs.filter((i) => i !== name))
			return true
		}
		return false
	}

	public removeOutput(name: string): boolean {
		if (this.hasOutput(name)) {
			this._outputNames$.next(this.outputs.filter((o) => o !== name))
			return true
		}
		return false
	}

	public suggestOutputName(name: string): string {
		const originalName = name.replace(/( \(\d+\))/, '')
		let derivedName = originalName
		let count = 1

		while (this.hasOutput(derivedName)) {
			derivedName = `${originalName} (${count})`
			count++
		}
		return derivedName
	}

	public assertInput(id: string | undefined, strict: boolean): void {
		// if id is undefined, we're binding the default input
		if (id !== undefined && !this.hasInput(id)) {
			if (strict) {
				throw new Error(`input name ${id} not declared`)
			} else {
				this.addInput(id)
			}
		}
	}

	public dispose(): void {
		this._inputNames$.complete()
		this._outputNames$.complete()
	}
}
