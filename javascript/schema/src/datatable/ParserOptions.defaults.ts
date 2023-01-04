/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ParserOptions } from './ParserOptions.js'

export const ParserOptionsDefaults: ParserOptions = {
	delimiter: ',',
	header: true,
	// TODO: these defaults are natively supported by arquero, but since they aren't configurable
	// we're turning them off for now to avoid triggering the papaparse fallback
	// lineTerminator: '\r\n',
	// quoteChar: '"',
	// skipBlankLines: true,
	skipRows: 0,
	readRows: Infinity,
}
