/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/schema'

export interface ParserProps {
	parser: ParserOptions
	onChange?: (parser: ParserOptions) => void
}
