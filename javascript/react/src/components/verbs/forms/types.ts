/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
import type { Step, Workflow } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { StepChangeFunction } from '../../../types.js'

/**
 * For reusable subcomponents that are combined in one interface
 * to manipulate a step.
 */
export interface StepSubformProps<T extends object | void | unknown = unknown>
	extends StepFormProps<T> {
	label?: string
}

/**
 * Basic props for a dump-component (not store/arquero attached)
 */
export interface StepFormBaseProps<
	T extends object | void | unknown = unknown,
> {
	step: Step<T>
	/**
	 * Event handler for when the step is changed in the component
	 */
	onChange?: StepChangeFunction<T>
}

export interface StepFormProps<T extends object | void | unknown = unknown>
	extends StepFormBaseProps<T> {
	/**
	 * TableStore to use for table lookups of step parameters.
	 */
	workflow?: Workflow
	/**
	 * ColumnTable to execute the step against if no store is provided.
	 */
	table?: ColumnTable
	/**
	 * Optional override of step input - there are many scenarios
	 * (particularly chains) where the driving input table for UI visibility should be shared,
	 * but the input to the actual step is an intermediate table.
	 */
	input?: string

	/**
	 * TableMetadata
	 */
	metadata?: TableMetadata

	/**
	 * The optional output table name; this information isn't stored on the step, so it has to
	 * be injected separately
	 */
	output: string | undefined

	/**
	 * Optional override for the label
	 */
	label?: string

	/**
	 * Event handler for when the output table name changes
	 */
	onChangeOutput: (value: string | undefined) => void
}
