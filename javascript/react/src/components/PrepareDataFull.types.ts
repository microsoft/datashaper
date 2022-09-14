/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { Workflow } from '@datashaper/workflow'
import type { ReactElement } from 'react'

export interface PrepareDataFullProps {
	/**
	 * The static input tables
	 */
	inputs: TableContainer[]

	/**
	 * Derived output tables
	 */
	derived: TableContainer[]

	/**
	 * The selected table id
	 */
	selectedTableId: string | undefined

	/**
	 * The data transformation workflow
	 */
	workflow: Workflow

	/**
	 * An optional command bar for the table header
	 */
	outputHeaderCommandBar?: ReactElement<any, any>

	/**
	 * Step positioning option
	 */
	stepsPosition?: 'bottom' | 'middle'

	/**
	 * Mutator for when the selected table id changes
	 */
	onSelectedTableIdChanged: (value: string | undefined) => void

	/**
	 * Handler for when the output table map changes
	 */
	onUpdateOutput?: (tables: TableContainer[]) => void
	/**
	 * Handler for when the workflow changes
	 */
	onUpdateWorkflow?: (workflow: Workflow) => void
}
