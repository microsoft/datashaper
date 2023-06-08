/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * The Id of the step to which the input is bound
 */
export type NodeRef = string

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
	input?: string | { source: NodeRef }
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
		source: NodeRef

		/**
		 * The secondary input, which must be specified
		 */
		other: NodeRef
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
		source: NodeRef

		/**
		 * The variadic secondary inputs
		 */
		others?: NodeRef[]
	}
}

export interface UnknownInput {
	input?: string | Record<string, NodeRef | NodeRef[]>
}
