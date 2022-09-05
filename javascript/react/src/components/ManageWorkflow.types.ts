/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { Workflow } from '@datashaper/workflow'

import type { TransformModalProps } from '../index.js'

export interface ManageWorkflowProps
	extends Omit<Omit<TransformModalProps, 'graph'>, 'index'> {
	/**
	 * The workflow specification
	 */
	workflow?: Workflow

	inputs: TableContainer[]

	/**
	 * Table selection handler
	 */
	onSelect?: (name: string) => void

	/**
	 * Event handler for when the output tableset changes
	 */
	onUpdateOutput?: (output: TableContainer[]) => void
	/**
	 * Handler for when the workflow changes
	 */
	onUpdateWorkflow?: (workflow: Workflow) => void
	historyView?: boolean
}
