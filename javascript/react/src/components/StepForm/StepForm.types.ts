/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
import type { Step, Workflow } from '@datashaper/workflow'

export interface StepFormProps {
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
	 * TableMetadata
	 */
	metadata?: TableMetadata

	/**
	 * The output table name
	 */
	output?: string

	/**
	 * Indicates that the input column should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the transform is expected to use the selected column when the modal is launched directly from a table.
	 */
	hideInputColumn?: boolean

	/**
	 * The step onchange handler
	 */
	onChange: (step: Step, index: number) => void

	/**
	 * Event handler for when the output table name changes
	 */
	onChangeOutput?: (value: string | undefined) => void
}
