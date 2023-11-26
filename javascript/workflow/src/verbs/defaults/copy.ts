/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CopyArgs } from '@datashaper/schema'
import { outputColumn } from './outputColumn.js'

export const copy = (): CopyArgs => ({
	...outputColumn(),
})
