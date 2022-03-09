/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableStore } from '@data-wrangling-components/core'
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
	/**
	 * Last output table to use as input & output for column transform
	 *  or as input for table transform
	 */
	nextInputTable?: string
	target?: string
}

export interface TableTransformModalProps extends TransformModalProps {
	/**
	 * Indicates that the input table should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the modal is launched directly from a table, which would make display redundant.
	 */
	hideInputTable?: boolean
	/**
	 * Indicates that the output table should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the transform is expected to do an inline replacement of the input table.
	 */
	hideOutputTable?: boolean
	/**
	 * Table store to verify naming to be created
	 */
	store?: TableStore
}

export interface ColumnTransformModalProps extends TransformModalProps {
	/**
	 * Indicates that the input column should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the modal is launched directly from a column, which would make display redundant.
	 */
	hideInputColumn?: boolean
	/**
	 * Indicates that the output column should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the transform is expected to do an inline replacement of the input column.
	 */
	hideOutputColumn?: boolean
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

/**
 * For reusable subcomponents that are combined in one interface
 * to manipulate a step.
 */
export interface StepSubcomponentProps extends StepComponentProps {
	label?: string
}

export interface StepDescriptionProps extends StepDependent {
	style?: React.CSSProperties
	showInput?: boolean
	showOutput?: boolean
	actions?: JSX.Element
}

export enum StepsType {
	Table = 'table',
	Column = 'column',
}

export interface DescriptionRow {
	/**
	 * Text to display in normal font before the value
	 */
	before?: string
	/**
	 * The configuration value to display with emphasized font
	 */
	value?: any
	/**
	 * Text to display in normal font after the value
	 */
	after?: string
	/**
	 * Recursive row children to render indented
	 */
	sub?: DescriptionRow[]
	/**
	 * Optional title text to use on node for tooltips/overflow
	 */
	title?: string
}

export interface VerbDescriptionProps extends StepDescriptionProps {
	rows: DescriptionRow[]
}
