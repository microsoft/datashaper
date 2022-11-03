/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableMetadata } from '@datashaper/tables'
import type { Step, Workflow } from '@datashaper/workflow'

export interface StepEditorProps {
	/**
	 * Table store to verify naming to be created
	 */
	workflow: Workflow

	/**
	 * Optional step for controlled component if pre-built config is planned.
	 */
	step?: Step

	/**
	 * The step index
	 */
	index: number

	/**
	 * Indicates that the input column should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the transform is expected to use the selected column when the modal is launched directly from a table.
	 */
	hideInputColumn?: boolean

	metadata?: TableMetadata

	style?: React.CSSProperties

	toggleGuidance?: () => void

	showGuidance?: boolean

	showGuidanceButton?: boolean

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
