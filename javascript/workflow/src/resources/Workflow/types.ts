/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { WorkflowStepId, Verb } from '@datashaper/schema'

/**
 * Options for exporting data-tables within Workflow instances.w
 */
export interface TableExportOptions {
	/**
	 * Whether to include input tables in the result.
	 */
	includeInputs?: boolean

	/**
	 * Whether to include the default input table in the result.
	 */
	includeDefaultInput?: boolean

	/**
	 * Whether to include the default output table in the result.
	 */
	includeDefaultOutput?: boolean
}

/**
 * Step input data for parsing workflow schemas
 */
export interface StepInput<T extends object | void | unknown = unknown> {
	/**
	 * A unique identifier for this step
	 */
	id?: string

	/**
	 * The verb being executed
	 */
	verb: Verb

	/**
	 * The verb arguments
	 */
	args?: T
	description?: string

	/**
	 * The bound inputs
	 * Key = Input Socket Name
	 * Value = Socket Binding to other node
	 */
	input?: Record<string, WorkflowStepId | WorkflowStepId[] | undefined>
}

/**
 * Resolved step data, used in living workflows
 */
export interface Step<T extends object | void | unknown = unknown> {
	/**
	 * A unique identifier for this step
	 */
	id: string

	/**
	 * The verb being execute
	 */
	verb: Verb

	/**
	 * The verb arguments
	 */
	args: T
	description?: string

	/**
	 * The bound inputs
	 * Key = Input Socket Name
	 * Value = Socket Binding to other node
	 */
	input: {
		source?: WorkflowStepId
		others?: WorkflowStepId[]
		[key: string]: WorkflowStepId | WorkflowStepId[] | undefined
	}
}
