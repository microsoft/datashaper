/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '../datapackage/ResourceSchema.js'
import type { Step } from './Step.js'
import type { WorkflowStepOutput } from './bindings.js'

/**
 * The root wrangling workflow specification.
 * resource profile: 'workflow'
 */
export interface WorkflowSchema extends ResourceSchema {
	profile: 'workflow'
	/**
	 * The workflow steps
	 */
	steps?: Step[]

	/**
	 * A list of input names that are expected to be provided in addition to the workflow steps
	 */
	input?: string[]

	/**
	 * A set of named outputs that this workflow will provide. 
	 * By default, workflows emit a default output, which is bound to the default output
	 * of the last step, but this configuration allows for more named outputs to be available.
	 */
	output?: {
		[key: string]: WorkflowStepOutput
	}
}
