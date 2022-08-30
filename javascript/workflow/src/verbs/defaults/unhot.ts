/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnhotArgs } from '@datashaper/schema'

import { inputColumnList } from './inputColumnList.js'
import { outputColumn } from './outputColumn.js'

export const unhot = (): UnhotArgs => ({
	prefix: '',
	keepOriginalColumns: false,
	...inputColumnList(),
	...outputColumn(),
})
