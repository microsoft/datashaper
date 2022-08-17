/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/schema'
import { BinStrategy } from '@datashaper/schema'

import { outputColumn } from './outputColumn.js'

export const bin = (): Omit<BinArgs, 'column'> => ({
	strategy: BinStrategy.Auto,
	fixedcount: 10,
	...outputColumn(),
})
