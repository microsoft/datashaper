/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DataShape, ParserOptions } from '@datashaper/schema'
import { DataOrientation } from '@datashaper/schema'

import { COMMENT_DEFAULT, DELIMITER_DEFAULT } from './typeHints.defaults.js'

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

export const DEFAULT_PARSER_OPTIONS: ParserOptions = {
	delimiter: DELIMITER_DEFAULT,
	comment: COMMENT_DEFAULT,
}

export const DEFAULT_DATA_SHAPE_JSON_OPTIONS: DataShape = {
	orientation: DataOrientation.Records,
}
