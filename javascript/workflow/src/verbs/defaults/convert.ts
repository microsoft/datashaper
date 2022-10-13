/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@datashaper/schema'
import { ParseType } from '@datashaper/schema'

import { outputColumn } from './outputColumn.js'

export const convert = (): Omit<ConvertArgs, 'column'> => ({
	type: ParseType.Decimal,
	formatPattern: '%Y-%m-%d',
	...outputColumn(),
})
