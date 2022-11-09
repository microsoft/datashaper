/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ErrorCode } from './ErrorCode.js'

export interface ValidationTestResult {
	fail?: boolean
	indexes?: number[]
	rule?: ErrorCode
}
