/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import type { CSSProperties } from 'react'

import type { DisplayOrder } from '../../enums.js'
import type { StepHeaderStyles } from './StepHeader.types.js'

export interface StepListStyles {
	root?: CSSProperties
	buttonContainer?: CSSProperties
	stepsContainer?: CSSProperties
	stepHeaders?: StepHeaderStyles
}

export interface StepListProps {
	/**
	 * The input workflow containing the step list
	 */
	workflow: Workflow

	/**
	 * The order to render the steps in. Default = latest on top
	 */
	order?: DisplayOrder

	/**
	 * Id of the selected step
	 */
	selectedKey?: string

	/**
	 * Deletes a workflow step at the specified index
	 * @param index - The index of the step to delete
	 */
	onDelete?: (index: number) => void

	/**
	 * Event handler for when a step is selected.
	 * @param name - The step name that was selected
	 */
	onSelect?: (name: string) => void

	/**
	 * Event handler for when the latest output table is selected.
	 * 'Latest' button will not be shown if this is not provided.
	 */
	onSelectLatestTable: () => void

	/**
	 * Event handler for when the input table is selected.
	 * 'Original' button will not be shown if this is not provided.
	 */
	onSelectInputTable: () => void

	/**
	 * Event handler for when a step needs to be saved
	 * @param step - The step to save
	 * @param index - The step index
	 */
	onSave?: (step: Step, index?: number) => void

	/**
	 * Styling for the step list
	 */
	styles?: StepListStyles
}
