/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnfoldArgs } from '@datashaper/schema'
export const unfold = (): Omit<UnfoldArgs, 'key' | 'value'> => ({})
