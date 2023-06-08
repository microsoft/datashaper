/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * The Id of the step to which the input is bound
 */
export type WorkflowStepId = string

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
	input?: string | { source: WorkflowStepId }
}

/**
 * Dual-input, single-output step I/O
 */
export interface DualInput extends BasicInput {
	/**
	 * The inputs that must be bound; "source" & "other".
	 */
	input: {
		/**
		 * The primary input, which must be specified
		 */
		source: WorkflowStepId

		/**
		 * The secondary input, which must be specified
		 */
		other: WorkflowStepId
	}
}

/**
 * Multi-input, single output step I/O
 */
export interface VariadicInput extends BasicInput {
	/**
	 * The step inputs; a required "source" and optional, variadic "others". If this is a
	 * string, it is used to bind the primary input.
	 */
	input: {
		/**
		 * The primary input
		 */
		source: WorkflowStepId

		/**
		 * The variadic secondary inputs
		 */
		others?: WorkflowStepId[]
	}
}

export interface UnknownInput {
	input?: string | {
		/** 
		 * Possible main input 
		 **/
		source?: WorkflowStepId

		/**
		 * Possible variadic input
		 */
		others?: WorkflowStepId[]

		/** Possible other input */
		[key: string]: WorkflowStepId | WorkflowStepId[] | undefined
		
	} | Record<string, WorkflowStepId | WorkflowStepId[]>
}
