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
	 * The id of the node to bind to
	 */
	node: string

	/**
	 * The named output of the node to bind with. If not defined, this will
	 * be the default output "target"
	 */
	output?: string
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
