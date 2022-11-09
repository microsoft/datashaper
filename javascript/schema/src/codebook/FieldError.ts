/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ErrorCode } from './ErrorCode.js'
import type { ValidationTestResult } from './ValidationTestResult.js'

export interface FieldError {
	name: string
	indexes?: number[]
	rule: ErrorCode
	callbackFunction?: () => ValidationTestResult
}
