/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ParserOptions as ParserOptionsSchema} from '@datashaper/schema';
import {
	ParserOptionsDefaults,
} from '@datashaper/schema'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import { Observed } from './Observed.js'

export class ParserOptions extends Observed implements ParserOptionsSchema {
	private _delimiter$ = new BehaviorSubject<string | undefined>(
		ParserOptionsDefaults.delimiter,
	)
	private _names$ = new BehaviorSubject<string[] | undefined>(
		ParserOptionsDefaults.names,
	)
	private _header$ = new BehaviorSubject<boolean | undefined>(
		ParserOptionsDefaults.header,
	)
	private _lineTerminator$ = new BehaviorSubject<string | undefined>(
		ParserOptionsDefaults.lineTerminator,
	)
	private _quoteChar$ = new BehaviorSubject<string | undefined>(
		ParserOptionsDefaults.quoteChar,
	)
	private _skipBlankLines$ = new BehaviorSubject<boolean | undefined>(
		ParserOptionsDefaults.skipBlankLines,
	)
	private _skipRows$ = new BehaviorSubject<number | undefined>(
		ParserOptionsDefaults.skipRows,
	)
	private _readRows$ = new BehaviorSubject<number | undefined>(
		ParserOptionsDefaults.readRows,
	)
	private _escapeChar$ = new BehaviorSubject<string | undefined>(
		ParserOptionsDefaults.escapeChar,
	)
	private _commentStart$ = new BehaviorSubject<string | undefined>(
		ParserOptionsDefaults.comment,
	)

	public constructor(schema?: ParserOptionsSchema) {
		super()
		this.loadSchema(schema)
	}

	public get delimiter$(): Observable<string | undefined> {
		return this._delimiter$
	}

	public get delimiter(): string | undefined {
		return this._delimiter$.value
	}

	public set delimiter(delimiter: string | undefined) {
		this._delimiter$.next(delimiter ?? ParserOptionsDefaults.delimiter!)
		this._onChange.next()
	}

	public get names$(): Observable<string[] | undefined> {
		return this._names$
	}

	public get names(): string[] | undefined {
		return this._names$.value
	}

	public set names(value: string[] | undefined) {
		this._names$.next(value)
		this._onChange.next()
	}

	public get header$(): Observable<boolean | undefined> {
		return this._header$
	}

	public get header(): boolean | undefined {
		return this._header$.value
	}

	public set header(value: boolean | undefined) {
		this._header$.next(value ?? ParserOptionsDefaults.header!)
		this._onChange.next()
	}

	public get lineTerminator$(): Observable<string | undefined> {
		return this._lineTerminator$
	}

	public get lineTerminator(): string | undefined {
		return this._lineTerminator$.value
	}

	public set lineTerminator(value: string | undefined) {
		this._lineTerminator$.next(value ?? ParserOptionsDefaults.lineTerminator!)
		this._onChange.next()
	}

	public get quoteChar$(): Observable<string | undefined> {
		return this._quoteChar$
	}

	public get quoteChar(): string | undefined {
		return this._quoteChar$.value
	}

	public set quoteChar(value: string | undefined) {
		this._quoteChar$.next(value ?? ParserOptionsDefaults.quoteChar!)
		this._onChange.next()
	}

	public get escapeChar$(): Observable<string | undefined> {
		return this._escapeChar$
	}

	public get escapeChar(): string | undefined {
		return this._escapeChar$.value
	}

	public set escapeChar(value: string | undefined) {
		this._escapeChar$.next(value)
		this._onChange.next()
	}

	public get comment$(): Observable<string | undefined> {
		return this._commentStart$
	}

	public get comment(): string | undefined {
		return this._commentStart$.value
	}

	public set comment(value: string | undefined) {
		this._commentStart$.next(value)
		this._onChange.next()
	}

	public get skipBlankLines$(): Observable<boolean | undefined> {
		return this._skipBlankLines$
	}

	public get skipBlankLines(): boolean | undefined {
		return this._skipBlankLines$.value
	}

	public set skipBlankLines(value: boolean | undefined) {
		this._skipBlankLines$.next(value ?? ParserOptionsDefaults.skipBlankLines!)
		this._onChange.next()
	}

	public get skipRows$(): Observable<number | undefined> {
		return this._skipRows$
	}

	public get skipRows(): number | undefined {
		return this._skipRows$.value
	}

	public set skipRows(value: number | undefined) {
		this._skipRows$.next(value ?? ParserOptionsDefaults.skipRows!)
		this._onChange.next()
	}

	public get readRows$(): Observable<number | undefined> {
		return this._readRows$
	}

	public get readRows(): number | undefined {
		return this._readRows$.value
	}

	public set readRows(value: number | undefined) {
		this._readRows$.next(value ?? ParserOptionsDefaults.readRows!)
		this._onChange.next()
	}

	public toSchema(): ParserOptionsSchema {
		return {
			delimiter: this._delimiter$.value,
			lineTerminator: this._lineTerminator$.value,
			comment: this._commentStart$.value,
			escapeChar: this._escapeChar$.value,
			names: this._names$.value,
			header: this._header$.value,
			quoteChar: this._quoteChar$.value,
			readRows: this._readRows$.value,
			skipBlankLines: this._skipBlankLines$.value,
			skipRows: this._skipRows$.value,
		}
	}

	public loadSchema(schema: Maybe<ParserOptionsSchema>, quiet?: boolean): void {
		const defaults = { ...ParserOptionsDefaults, ...schema }
		this._delimiter$.next(defaults.delimiter)
		this._lineTerminator$.next(defaults.lineTerminator)
		this._quoteChar$.next(defaults.quoteChar)
		this._skipBlankLines$.next(defaults.skipBlankLines)
		this._skipRows$.next(defaults.skipRows)
		this._readRows$.next(defaults.readRows)
		this._names$.next(defaults.names)
		this._escapeChar$.next(defaults.escapeChar)
		this._commentStart$.next(defaults.comment)

		if (!quiet) {
			this._onChange.next()
		}
	}
}
