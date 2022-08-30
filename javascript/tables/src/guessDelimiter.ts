/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParseConfig } from 'papaparse'
import { default as papa } from 'papaparse'

export function guessDelimiter(text: string, config?: ParseConfig): string {
	return papa.parse(text, { preview: 10, ...config }).meta.delimiter
}
