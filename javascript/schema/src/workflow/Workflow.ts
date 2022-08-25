/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '../datapackage/Resource.js'
import type { OutputPortBinding } from './bindings.js'
import type { Step } from './Step.js'

/**
 * The root wrangling workflow specification.
 * profile: 'workflow'
 */
export interface Workflow extends Resource {
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
