/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore, Step } from '@data-wrangling-components/core'
import type { IDropdownOption, IModalProps } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export type StepChangeFunction = (step: Step) => void
export type HOCFunction<T> = (Component: React.FC<T>) => React.FC<T>

export type DropdownOptionChangeFunction = (
	event: React.FormEvent<HTMLDivElement>,
	option?: IDropdownOption,
	index?: number,
) => void

export interface TransformModalProps extends IModalProps {
	/**
	 * Table to build the transform from.
	 */
	table?: ColumnTable
	/**
	 * Optional step for controlled component if pre-built config is planned.
	 */
	step?: Step
	/**
	 * Callback fired when the step is configured and "run" is clicked, indicating
	 * the application should execute the contructed/edited step.
	 */
	onTransformRequested?: (step: Step, index?: number) => void
	/**
	 * Optional list of transform verbs to present to the user.
	 * If not supplied, all verbs for the desired operation (table or column) will be presented.
	 */
	verbs?: string[]
	/**
	 * Optional header text to display on the modal
	 */
	headerText?: string
}

export interface StepDependent {
	step: Step
}

export interface StepComponentProps extends StepDependent {
	/**
	 * TableStore to use for table lookups of step parameters.
	 */
	store?: TableStore
	/**
	 * ColumnTable to execute the step against if no store is provided.
	 */
	table?: ColumnTable
	/**
	 * Optional override of step input - there are many scenarios
	 * (particularly chains) where the driving input table for UI visbility should be shared,
	 * but the input to the actual step is an intermediate table.
	 */
	input?: string
	onChange?: StepChangeFunction
}

export interface StepDescriptionProps extends StepDependent {
	showInput?: boolean
	showOutput?: boolean
	actions?: JSX.Element
}
