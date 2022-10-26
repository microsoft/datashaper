/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnError } from './ColumnError.js'

export interface ValidationResult {
	columnErrors?: ColumnError[]
}
