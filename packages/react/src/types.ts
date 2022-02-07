/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableStore, Step } from '@data-wrangling-components/core'
import { IDropdownOption } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

export type StepChangeFunction = (step: Step) => void
export type HOCFunction<T> = (Component: React.FC<T>) => React.FC<T>

export type DropdownOptionChangeFunction = (
	event: React.FormEvent<HTMLDivElement>,
	option?: IDropdownOption,
	index?: number,
) => void

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
}

export interface TableFile {
	name: string
	table: ColumnTable
}
