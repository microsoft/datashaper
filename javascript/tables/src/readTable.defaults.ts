/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export const ARQUERO_SUPPORTED_OPTS = new Set([
	'delimiter',
	'names',
	'header',
	'comment',
	'skipRows',
	'readRows',
	'converters',
])

export const ARQUERO_PROPS_MAP = {
	skipRows: 'skip',
}

export const PAPAPARSE_SUPPORTED_OPTS = new Set([
	'delimiter',
	'header',
	'comment',
	'lineTerminator',
	'quoteChar',
	'escapeChar',
	'skipBlankLines',
	'skipRows',
	'readRows',
])

export const PAPAPARSE_PROPS_MAP = {
	comment: 'comments',
	lineTerminator: 'newline',
	skipBlankLines: 'skipEmptyLines',
	readRows: 'preview',
}

export const LINE_TERMINATORS = new Set(['\r', '\r\n', '\n'])
