/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import type { ICommandBarProps } from '@fluentui/react'

export interface ProjectMgmtCommandBarProps
	extends Omit<ICommandBarProps, 'items'> {
	/**
	 * The data transformation workflow
	 */
	workflow: Workflow

	/**
	 * The input data tables
	 */
	tables: TableContainer[]

	/**
	 * The output data table
	 */
	outputTables: TableContainer[]

	/**
	 * Handler for when the workflow changes
	 */
	onUpdateWorkflow: (steps: Workflow) => void

	/**
	 * Handler for when input tableset changes
	 */
	onUpdateTables: (tables: TableContainer[]) => void
}
