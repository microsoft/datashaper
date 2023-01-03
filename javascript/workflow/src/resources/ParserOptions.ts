/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions as ParserOptionsSchema } from '@datashaper/schema'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import { Observed } from './Observed.js'

const DEFAULT_DELIMITER = ','
const DEFAULT_QUOTE = '"'
const DEFAULT_LINE_TERMINATOR = '\n'
const DEFAULT_HEADER = true
const DEFAULT_SKIP_BLANK_LINES = true
const DEFAULT_SKIP_ROWS = 0
const DEFAULT_READ_ROWS = Infinity

export class ParserOptions extends Observed implements ParserOptionsSchema {
	private _delimiter$ = new BehaviorSubject<string>(DEFAULT_DELIMITER)
	private _names$ = new BehaviorSubject<string[] | undefined>(undefined)
	private _header$ = new BehaviorSubject<boolean | undefined>(DEFAULT_HEADER)
	private _lineTerminator$ = new BehaviorSubject<string>(
		DEFAULT_LINE_TERMINATOR,
	)
	private _quoteChar$ = new BehaviorSubject<string>(DEFAULT_QUOTE)
	private _skipBlankLines$ = new BehaviorSubject<boolean>(
		DEFAULT_SKIP_BLANK_LINES,
	)
	private _skipRows$ = new BehaviorSubject<number>(DEFAULT_SKIP_ROWS)
	private _readRows$ = new BehaviorSubject<number>(DEFAULT_READ_ROWS)
	private _escapeChar$ = new BehaviorSubject<string | undefined>(undefined)
	private _commentStart$ = new BehaviorSubject<string | undefined>(undefined)

	public constructor(schema?: ParserOptionsSchema) {
		super()
		this.loadSchema(schema)
	}

	public get delimiter$(): Observable<string> {
		return this._delimiter$
	}

	public get delimiter(): string {
		return this._delimiter$.value
	}

	public set delimiter(delimiter: string | undefined) {
		this._delimiter$.next(delimiter ?? DEFAULT_DELIMITER)
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
		this._header$.next(value ?? DEFAULT_HEADER)
		this._onChange.next()
	}

	public get lineTerminator$(): Observable<string> {
		return this._lineTerminator$
	}

	public get lineTerminator(): string {
		return this._lineTerminator$.value
	}

	public set lineTerminator(value: string | undefined) {
		this._lineTerminator$.next(value ?? DEFAULT_LINE_TERMINATOR)
		this._onChange.next()
	}

	public get quoteChar$(): Observable<string> {
		return this._quoteChar$
	}

	public get quoteChar(): string {
		return this._quoteChar$.value
	}

	public set quoteChar(value: string | undefined) {
		this._quoteChar$.next(value ?? DEFAULT_QUOTE)
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

	public get skipBlankLines$(): Observable<boolean> {
		return this._skipBlankLines$
	}

	public get skipBlankLines(): boolean {
		return this._skipBlankLines$.value
	}

	public set skipBlankLines(value: boolean | undefined) {
		this._skipBlankLines$.next(value ?? DEFAULT_SKIP_BLANK_LINES)
		this._onChange.next()
	}

	public get skipRows$(): Observable<number> {
		return this._skipRows$
	}

	public get skipRows(): number {
		return this._skipRows$.value
	}

	public set skipRows(value: number | undefined) {
		this._skipRows$.next(value ?? DEFAULT_SKIP_ROWS)
		this._onChange.next()
	}

	public get readRows$(): Observable<number> {
		return this._readRows$
	}

	public get readRows(): number {
		return this._readRows$.value
	}

	public set readRows(value: number | undefined) {
		this._readRows$.next(value ?? DEFAULT_READ_ROWS)
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
		this._delimiter$.next(schema?.delimiter ?? DEFAULT_DELIMITER)
		this._lineTerminator$.next(
			schema?.lineTerminator ?? DEFAULT_LINE_TERMINATOR,
		)
		this._quoteChar$.next(schema?.quoteChar ?? DEFAULT_QUOTE)
		this._skipBlankLines$.next(
			schema?.skipBlankLines ?? DEFAULT_SKIP_BLANK_LINES,
		)
		this._skipRows$.next(schema?.skipRows ?? DEFAULT_SKIP_ROWS)
		this._readRows$.next(schema?.readRows ?? DEFAULT_READ_ROWS)
		this._names$.next(schema?.names)
		this._escapeChar$.next(schema?.escapeChar)
		this._commentStart$.next(schema?.comment)

		if (!quiet) {
			this._onChange.next()
		}
	}
}
