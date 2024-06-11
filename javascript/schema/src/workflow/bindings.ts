/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * The Id of the step to which the input is bound
 */
export type WorkflowStepId = string
export type WorkflowStepNamedOutput = { step: WorkflowStepId, table?: string }
export type WorkflowStepOutput = WorkflowStepId | WorkflowStepNamedOutput


/**
 * Single-input, single-output step I/O
 */
export interface BasicInput {
	/**
	 * Standard step input; single source with default name "source".
	 *
	 * If undefined, the default output of the previous step will be used (if available).
	 * If no previous step is available, this will remain undefined
	 */
	input?: WorkflowStepId | {
		source: WorkflowStepOutput
	}
}

/**
 * Dual-input, single-output step I/O
 */
export interface DualInput {
	/**
	 * The inputs that must be bound; "source" & "other".
	 */
	input: {
		/**
		 * The primary input, which must be specified
		 */
		source: WorkflowStepOutput

		/**
		 * The secondary input, which must be specified
		 */
		other: WorkflowStepOutput
	}
}

/**
 * Multi-input, single output step I/O
 */
export interface VariadicInput {
	/**
	 * The step inputs; a required "source" and optional, variadic "others". If this is a
	 * string, it is used to bind the primary input.
	 */
	input: {
		/**
		 * The primary input
		 */
		source: WorkflowStepOutput

		/**
		 * The variadic secondary inputs
		 */
		others?: WorkflowStepOutput[]
	}
}

export interface UnknownInput {
	input?:
		| WorkflowStepOutput
		| {
				/**
				 * Possible main input
				 **/
				source?: WorkflowStepOutput

				/**
				 * Possible variadic input
				 */
				others?: WorkflowStepOutput[]

				/** Possible other input */
				[key: string]: WorkflowStepOutput | WorkflowStepOutput[] | undefined
		  }
}
