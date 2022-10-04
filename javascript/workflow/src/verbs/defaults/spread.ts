/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@datashaper/schema'

export const spread = (): Omit<SpreadArgs, 'column'> => ({
	to: [],
})
