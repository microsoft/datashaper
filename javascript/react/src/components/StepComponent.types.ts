/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'

export interface StepComponentProps {
	/**
	 * The workflow instance
	 */
	workflow: Workflow

	/**
	 * The processing step
	 */
	step: Step

	/**
	 * The step index
	 */
	index: number

	/**
	 * The output table name
	 */
	output?: string

	/**
	 * Label for the input-table dropdown
	 */
	inputTableLabel?: string

	/**
	 * Label for the input table dropdown
	 */
	inputColumnLabel?: string

	/**
	 * The label to use for the output column field
	 */
	outputColumnLabel?: string

	/**
	 * The label to use for the output field
	 */
	outputTableLabel?: string

	/**
	 * Whether the output table name is disabled
	 */
	outputTableDisabled?: boolean

	/**
	 * The step onchange handler
	 */
	onChange: (step: Step, index: number) => void

	/**
	 * Event handler for when the output table name changes
	 */
	onChangeOutput: (value: string | undefined) => void
}
