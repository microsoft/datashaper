/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Verb } from '@datashaper/schema'
import type { TableMetadata } from '@datashaper/tables'
import type { Step, Workflow } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export interface StepStackItemProps {
	/**
	 * Table to build the transform from.
	 */
	table?: ColumnTable

	/**
	 * Optional step for controlled component if pre-built config is planned.
	 */
	step?: Step

	/**
	 * The step index
	 */
	index: number

	/**
	 * Optional list of transform verbs to present to the user.
	 * If not supplied, all verbs for the desired operation (table or column) will be presented.
	 */
	verbs?: string[]

	/**
	 * Optional header text to display on the modal
	 */
	headerText?: string

	target?: string

	/**
	 * Indicates that the input table should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the modal is launched directly from a table, which would make display redundant.
	 */
	hideInput?: boolean

	/**
	 * Indicates that the output table should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the transform is expected to do an inline replacement of the input table.
	 */
	hideOutput?: boolean

	/**
	 * Indicates that the input column should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the transform is expected to use the selected column when the modal is launched directly from a table.
	 */
	hideInputColumn?: boolean

	/**
	 * Table store to verify naming to be created
	 */
	workflow: Workflow

	metadata?: TableMetadata

	onVerbChange?: (verb: Verb) => void

	style?: React.CSSProperties

	toggleGuidance?: () => void

	showGuidance?: boolean

	showGuidanceButton?: boolean

	hideStepSelector?: boolean

	/**
	 * Callback fired when the step is configured and "run" is clicked, indicating
	 * the application should execute the contructed/edited step.
	 */
	onSave?: (step: Step) => void

	/**
	 * Callback fired when the delete button is clicked.
	 */
	onDelete?: () => void
}
