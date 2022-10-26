/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type PortBinding = string | NamedPortBinding
export type OutputPortBinding = string | NamedOutputPortBinding

/**
 * An explicit step input binding
 */
export interface NamedPortBinding {
	/**
	 * The id of the input node to bind to
	 */
	node: string
}

/**
 * An explicit workflow output
 */
export interface NamedOutputPortBinding extends NamedPortBinding {
	/**
	 * The output table name
	 */
	name: string
}

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
	input?: string | { source: PortBinding }
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
		source: PortBinding

		/**
		 * The secondary input, which must be specified
		 */
		other: PortBinding
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
		source: PortBinding

		/**
		 * The variadic secondary inputs
		 */
		others?: PortBinding[]
	}
}
