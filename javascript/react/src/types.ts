/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableStore } from '@data-wrangling-components/core'
import type { IModalProps } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export type HOCFunction<T> = (Component: React.FC<T>) => React.FC<T>

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

export enum StepsType {
	Table = 'table',
	Column = 'column',
}
