/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DestructureArgs } from '@datashaper/schema'

export const destructure = (): Omit<DestructureArgs, 'column'> => ({
	keys: [],
})
