/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	NamedOutputPortBinding,
	NamedPortBinding,
	PortBinding,
	Specification,
	StepCommon,
} from '../specification.js'
import type { Verb } from '../verbs/index.js'

export interface SpecificationInput {
	input?: Specification['input']
	output: Specification['output']
	steps: StepInput[]
}

export interface StepInput<T extends object | void | unknown = unknown>
	extends StepCommon {
	/**
	 * The verb being executed
	 */
	verb: Verb

	/**
	 * The verb arguments
	 */
	args?: T

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

	/**
	 * The bound inputs
	 * Key = Input Socket Name
	 * Value = Socket Binding to other node
	 */
	input: {
		others?: NamedPortBinding[]
	} & Record<string, NamedPortBinding>
}

export interface ParsedSpecification {
	steps: Step[]
	input: Set<string>
	output: Map<string, NamedOutputPortBinding>
}
