/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FieldError } from './FieldError.js'

export interface ValidationResult {
	errors: FieldError[]
}
