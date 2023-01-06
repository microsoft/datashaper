/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ParserOptions } from './ParserOptions.js'

export const ParserOptionsDefaults: ParserOptions = {
	delimiter: ',',
	header: true,
	lineTerminator: '\n',
	quoteChar: '"',
	skipBlankLines: true,
	skipRows: 0,
	readRows: Infinity,
}
