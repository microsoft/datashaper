/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Constraints } from './Constraints.js'
import type { ErrorCode } from './ErrorCode.js'

export interface FieldError {
	/**
	 * Name of the field this error is associated with
	 */
	name: string
	/**
	 * Rule that failed
	 */
	rule: ErrorCode
	/**
	 * Constraints for the field so parameters can be retrieved.
	 * Note that there must be an entry in the constraints object for the rule that failed.
	 */
	constraints: Constraints
	/**
	 * Optional row indexes that failed the validation (if `includeIndexes` was true during validation)
	 */
	indexes?: number[]
	/**
	 * Validation function that produced the error, useful for re-applying at runtime.
	 */
	validate?: ValidationFunction
}

export type ValidationFunction = (values: unknown[]) => FieldError | undefined
