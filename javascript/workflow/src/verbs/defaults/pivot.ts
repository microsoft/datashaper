/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '@datashaper/schema'
import { FieldAggregateOperation } from '@datashaper/schema'
export const pivot = (): Omit<PivotArgs, 'key' | 'value'> => ({
	operation: FieldAggregateOperation.Any,
})
