/**
 * Step input specifications. If this is a string, we'll bind to the default output
 * of the given node ID. If no node has that ID, we'll bind against the table-store's
 * named table given the string.
 *
 * If this is an input binding, it's an explicit binding to another step in the pipeline.
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
