/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions as ParserOptionsSchema } from '@datashaper/schema'

import type { Maybe } from '../primitives.js'
import { Observed } from './Observed.js'

const DEFAULT_DELIMITER = ','
const DEFAULT_QUOTE = '"'
const DEFAULT_LINE_TERMINATOR = '\n'
const DEFAULT_SKIP_BLANK_LINES = true
const DEFAULT_SKIP_ROWS = 0
const DEFAULT_READ_ROWS = Infinity

export class ParserOptions extends Observed implements ParserOptionsSchema {
	private _delimiter: string
	private _names: string[] | undefined
	private _lineTerminator: string
	private _quoteChar: string
	private _skipBlankLines: boolean
	private _skipRows: number
	private _readRows: number
	private _escapeChar: string | undefined
	private _commentStart: string | undefined

	public constructor(parserOptions?: ParserOptionsSchema) {
		super()
		this._delimiter = parserOptions?.delimiter ?? DEFAULT_DELIMITER
		this._lineTerminator =
			parserOptions?.lineTerminator ?? DEFAULT_LINE_TERMINATOR
		this._quoteChar = parserOptions?.quoteChar ?? DEFAULT_QUOTE
		this._skipBlankLines =
			parserOptions?.skipBlankLines ?? DEFAULT_SKIP_BLANK_LINES
		this._skipRows = parserOptions?.skipRows ?? DEFAULT_SKIP_ROWS
		this._readRows = parserOptions?.readRows ?? DEFAULT_READ_ROWS
		this._names = parserOptions?.names
		this._escapeChar = parserOptions?.escapeChar
		this._commentStart = parserOptions?.comment
	}

	public get delimiter(): string {
		return this._delimiter
	}

	public set delimiter(delimiter: string | undefined) {
		this._delimiter = delimiter ?? DEFAULT_DELIMITER
		this._onChange.next()
	}

	public get names(): string[] | undefined {
		return this._names
	}

	public set names(value: string[] | undefined) {
		this._names = value
		this._onChange.next()
	}

	public get lineTerminator(): string {
		return this._lineTerminator
	}

	public set lineTerminator(value: string | undefined) {
		this._lineTerminator = value ?? DEFAULT_LINE_TERMINATOR
		this._onChange.next()
	}

	public get quoteChar(): string {
		return this._quoteChar
	}

	public set quoteChar(value: string | undefined) {
		this._quoteChar = value ?? DEFAULT_QUOTE
		this._onChange.next()
	}

	public get escapeChar(): string | undefined {
		return this._escapeChar
	}

	public set escapeChar(value: string | undefined) {
		this._escapeChar = value
		this._onChange.next()
	}

	public get comment(): string | undefined {
		return this._commentStart
	}

	public set comment(value: string | undefined) {
		this._commentStart = value
		this._onChange.next()
	}

	public get skipBlankLines(): boolean {
		return this._skipBlankLines
	}

	public set skipBlankLines(value: boolean | undefined) {
		this._skipBlankLines = value ?? DEFAULT_SKIP_BLANK_LINES
		this._onChange.next()
	}

	public get skipRows(): number {
		return this._skipRows
	}

	public set skipRows(value: number | undefined) {
		this._skipRows = value ?? DEFAULT_SKIP_ROWS
		this._onChange.next()
	}

	public get readRows(): number {
		return this._readRows
	}

	public set readRows(value: number | undefined) {
		this._readRows = value ?? DEFAULT_READ_ROWS
		this._onChange.next()
	}

	public toSchema(): ParserOptionsSchema {
		return {
			delimiter: this._delimiter,
			lineTerminator: this._lineTerminator,
			comment: this._commentStart,
			escapeChar: this._escapeChar,
			names: this._names,
			quoteChar: this._quoteChar,
			readRows: this._readRows,
			skipBlankLines: this._skipBlankLines,
			skipRows: this._skipRows,
		}
	}

	public loadSchema(schema: Maybe<ParserOptionsSchema>, quiet?: boolean): void {
		this._delimiter = schema?.delimiter ?? DEFAULT_DELIMITER
		this._lineTerminator = schema?.lineTerminator ?? DEFAULT_LINE_TERMINATOR
		this._quoteChar = schema?.quoteChar ?? DEFAULT_QUOTE
		this._skipBlankLines = schema?.skipBlankLines ?? DEFAULT_SKIP_BLANK_LINES
		this._skipRows = schema?.skipRows ?? DEFAULT_SKIP_ROWS
		this._readRows = schema?.readRows ?? DEFAULT_READ_ROWS
		this._names = schema?.names
		this._escapeChar = schema?.escapeChar
		this._commentStart = schema?.comment
		if (!quiet) {
			this._onChange.next()
		}
	}
}
