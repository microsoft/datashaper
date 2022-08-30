/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '@datashaper/schema'

import { inputColumnList } from './inputColumnList.js'

export const fold = (): FoldArgs => ({
	to: ['key', 'value'],
	...inputColumnList(),
})
