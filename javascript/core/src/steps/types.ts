/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputBinding,
	InputSpecification,
	StepCommon,
} from '../specification.js'
import type { Verb } from '../verbs/index.js'

export interface SpecificationInput {
	input?: string
	output?: string
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
				others?: InputSpecification[]
		  } & Record<string, InputSpecification>)

	/**
	 * The observed outputs to record.
	 * Key = output socket name
	 * Value = store table name
	 */
	output: string | Record<string, string>
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
		others?: InputBinding[]
	} & Record<string, InputBinding>

	/**
	 * The observed outputs to record.
	 * Key = output socket name
	 * Value = store table name
	 */
	output: Record<string, string>
}
