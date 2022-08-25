/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OutputPortBinding } from './bindings.js'
import type { StepDefinition } from './StepDefinition.js'

/**
 * The root wrangling workflow specification. (Used for generating JSON Schema)
 */
export interface WorkflowDefinition {
	/**
	 * The schema url of the specification
	 */
	$schema?: string
	/**
	 * The name of the specification
	 */
	name?: string

	/**
	 * A user-friendly description of the specification
	 */
	description?: string

	/**
	 * The workflow steps
	 */
	steps?: StepDefinition[]

	/**
	 * A list of input names that are expected to be provided in addition to the workflow steps
	 */
	input?: string[]

	/**
	 * The output bindings
	 */
	output: Array<OutputPortBinding>
}
