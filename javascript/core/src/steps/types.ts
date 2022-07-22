/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	NamedPortBinding,
	OutputPortBinding,
	PortBinding,
} from '../types.js'
import type { Verb } from '../verbs/index.js'

export interface WorkflowObject {
	$schema?: string
	name?: string
	description?: string
	input?: string[]
	output: OutputPortBinding[]
	steps: StepInput[]
}

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
	input?:
		| string
		| ({
				others?: PortBinding[]
		  } & Record<string, PortBinding>)
}

export interface Step<T extends object | void | unknown = unknown> {
	/**
	 * A unique identifier for this step
	 */
	id: string

	/**
	 * The verb being executed
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
		others?: NamedPortBinding[]
	} & Record<string, NamedPortBinding>
}
