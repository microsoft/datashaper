/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ParserOptionsDefaults } from '@datashaper/schema'

/**
 * These are options that Arquero allows to be configured.
 */
export const ARQUERO_SUPPORTED_OPTS = new Set([
	'delimiter',
	'names',
	'header',
	'comment',
	'skipRows',
	'readRows',
])

/**
 * These are options that Arquero does _not_ allow to be configured,
 * but if we specify their internal default, we should still use the Arquero parser.
 */
export const ARQUERO_INTERNAL_DEFAULTS = new Map<string, any>([
	['lineTerminator', ParserOptionsDefaults.lineTerminator],
	['quoteChar', ParserOptionsDefaults.quoteChar],
	['skipBlankLines', ParserOptionsDefaults.skipBlankLines],
])

export const PAPAPARSE_SUPPORTED_OPTS = new Set([
	'delimiter',
	'header',
	'comment',
	'lineTerminator',
	'quoteChar',
	'escapeChar',
	'skipBlankLines',
	'skipRows',
])

export const PAPAPARSE_PROPS_MAP = {
	comment: 'comments',
	lineTerminator: 'newline',
	skipBlankLines: 'skipEmptyLines',
	readRows: 'preview',
}

export const LINE_TERMINATORS = new Set(['\r', '\r\n', '\n'])
