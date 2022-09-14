/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export const arqueroSupportedOptions = new Set([
	'delimiter',
	'names',
	'header',
	'comment',
	'skipRows',
	'readRows',
	'converters',
])

export const arqueroPropMap = {
	skipRows: 'skip',
}

export const papaParseSupportedOptions = new Set([
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

export const papaParsePropsMap = {
	comment: 'comments',
	lineTerminator: 'newline',
	skipBlankLines: 'skipEmptyLines',
	readRows: 'preview',
}

export const lineTerminators = new Set(['\r', '\r\n', '\n'])
