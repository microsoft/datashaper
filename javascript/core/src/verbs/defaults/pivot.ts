/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '../pivot.js'
import { FieldAggregateOperation } from '../types.js'
export const pivot = (): PivotArgs => {
	return {
		key: '',
		value: '',
		operation: FieldAggregateOperation.Any,
	}
}
