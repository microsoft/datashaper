/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '../datapackage/ResourceSchema.js'
import type { OutputPortBinding } from './bindings.js'
import type { Step } from './Step.js'

/**
 * The root wrangling workflow specification.
 * resource profile: 'workflow'
 */
export interface WorkflowSchema extends ResourceSchema {
	/**
	 * The workflow steps
	 */
	steps?: Step[]

	/**
	 * A list of input names that are expected to be provided in addition to the workflow steps
	 */
	input?: string[]

	/**
	 * The output bindings
	 */
	output: Array<OutputPortBinding>
}
